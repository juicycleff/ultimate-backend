import {
  AggregationCursor,
  Collection,
  CollectionAggregationOptions,
  Cursor,
  DeleteWriteOpResultObject,
  ObjectID,
} from 'mongodb';
import { CacheStore } from '@nestjs/common';
import * as moment from 'moment';
import { MongoCollectionProps, MongoDBSource } from '../interfaces';
import { DataEvents } from '../../../enums';
import {
  COLLECTION_KEY,
  CursorEdge,
  CursorPaginationRequest,
  CursorResponse,
  FindRequest,
  POST_KEY,
  PRE_KEY,
  TenantData,
  UpdateByIdRequest,
  UpdateRequest,
} from '../../../interfaces';
import { cleanEmptyProperties, NotFoundError } from '@ultimatebackend/common';
import { DateTime } from 'luxon';
import { merge } from 'lodash';

// that class only can be extended
export class BaseMongoRepository<DOC, DTO = DOC> {
  collection: Promise<Collection<DOC>>;
  readonly options: MongoCollectionProps;
  readonly tenant: TenantData;
  readonly cacheStore: CacheStore;

  /**
   * Creates an instance of BaseMongoRepository.
   * @param {DBSource} dbSource Your MongoDB connection
   * @param cacheStore
   * @param opts
   * @param tenantData
   * @memberof BaseMongoRepository
   */
  constructor(
    public dbSource: MongoDBSource,
    cacheStore?: CacheStore,
    opts?: MongoCollectionProps,
    tenantData?: TenantData,
  ) {
    this.options = Object.assign(
      {},
      opts,
      Reflect.getMetadata(COLLECTION_KEY, this),
    );
    if (!this.options.name) {
      throw new Error('No name was provided for this collection');
    }

    // Assign tenant DI
    if (tenantData) {
      this.tenant = tenantData;
    }

    // Assign cache DI
    if (cacheStore) {
      this.cacheStore = cacheStore;
    }
    this.collection = this.getCollection();
  }

  /**
   * Finds a record by id
   *
   * @param {string} id
   * @returns {Promise<DOC>}
   * @memberof BaseMongoRepository
   */
  async findById(id: string): Promise<DOC> {
    const condition = {
      _id: new ObjectID(id),
      tenantId: this.tenant?.tenantId,
    };
    const cleanConditions = cleanEmptyProperties(condition);

    const cacheKey = JSON.stringify(cleanConditions);
    const cachedResult = await this.retrieveFromCache(cacheKey);
    if (!Array.isArray(cachedResult)) {
      return cachedResult;
    }

    const result = await this.findOne(cleanConditions);
    await this.saveToCache(cacheKey, result);

    return result;
  }

  /**
   * Find multiple documents by a list of ids
   *
   * @param {string[]} ids
   * @returns {Promise<T[]>}
   * @memberof BaseMongoRepository
   */
  async findManyById(ids: string[]): Promise<DOC[]> {
    const collection = await this.collection;
    const query = { _id: { $in: ids.map((id) => new ObjectID(id)) } };

    const cacheKey = JSON.stringify(query);
    const cachedResult = await this.retrieveFromCache(cacheKey);
    if (Array.isArray(cachedResult)) {
      return cachedResult;
    }

    const found = await collection
      .find(query as Record<string, unknown>)
      .toArray();

    const results: DOC[] = [];
    for (const result of found) {
      results.push(
        await this.invokeEvents(
          POST_KEY,
          ['FIND', 'FIND_MANY'],
          this.toggleId(result, false),
        ),
      );
    }

    await this.saveToCache(cacheKey, results);
    return results;
  }

  /**
   * Finds a record by a list of conditions
   *
   * @param {object} conditions
   * @param noCache
   * @returns {Promise<DOC>}
   * @memberof BaseMongoRepository
   */
  async findOne(
    conditions: Record<string, unknown>,
    noCache = false,
  ): Promise<DOC> {
    const collection = await this.collection;

    const cleanConditions = cleanEmptyProperties({
      ...conditions,
      tenantId: this.tenant?.tenantId,
    });
    const prunedConditions = this.toggleId(cleanConditions, true) as any;

    const cacheKey = JSON.stringify(prunedConditions);

    if (noCache === false) {
      const cachedResult = await this.retrieveFromCache(cacheKey);
      if (
        cachedResult !== null &&
        cachedResult !== undefined &&
        !Array.isArray(cachedResult)
      ) {
        return cachedResult;
      }
    }

    let document = await collection.findOne(prunedConditions);
    if (document) {
      document = this.toggleId(document, false) as any;
      document = await this.invokeEvents(
        POST_KEY,
        ['FIND', 'FIND_ONE'],
        document,
      );
      // document = this.convertDateToString(document);
      if (noCache === false) {
        await this.saveToCache(cacheKey, document);
      }
      return document;
    }
  }

  /**
   * Finds a record by a list of conditions
   *
   * @returns {Promise<DOC>}
   * @memberof BaseMongoRepository
   * @param pipeline
   * @param options
   */
  async aggregate(
    pipeline?: Record<string, unknown>[],
    options?: CollectionAggregationOptions,
  ): Promise<
    AggregationCursor<DOC> | AggregationCursor<DOC[]> | AggregationCursor<any>
  > {
    const collection = await this.collection;

    const cacheKey = JSON.stringify(pipeline);
    const cachedResult = await this.retrieveFromCache(cacheKey);
    if (cachedResult) {
      return cachedResult as any;
    }

    const result = await collection.aggregate(pipeline, options);
    await this.saveToCache(cacheKey, result);
    return result;
  }

  /**
   * Find records by a list of conditions
   *
   * @param {FindRequest} [req={ conditions: {} }]
   * @returns {Promise<T[]>}
   * @memberof BaseMongoRepository
   */
  async find(req: FindRequest = { conditions: {} }): Promise<DOC[]> {
    const collection = await this.collection;

    const cleanConditions = cleanEmptyProperties({
      tenantId: this.tenant?.tenantId,
      ...req.conditions,
    });
    const conditions = this.toggleId(cleanConditions as any, true) as any;

    const cacheKey = JSON.stringify(conditions) + JSON.stringify(req);
    const cachedResult = await this.retrieveFromCache(cacheKey);
    if (Array.isArray(cachedResult)) {
      return cachedResult;
    }

    let cursor = collection.find(conditions);

    if (req.projection) {
      cursor = cursor.project(req.projection);
    }

    if (req.sort) {
      cursor = cursor.sort(req.sort);
    }

    if (req.skip) {
      cursor = cursor.skip(req.skip);
    }

    if (req.limit) {
      cursor = cursor.limit(req.limit);
    }

    const newDocuments = await cursor.toArray();
    const results = [];

    let correctDoc = null;
    for (let i = 0; i < newDocuments.length; i += 2) {
      const nextCount = i + 1;

      correctDoc = this.toggleId(newDocuments[i], false) as any;
      correctDoc = await this.invokeEvents(
        POST_KEY,
        ['FIND', 'FIND_MANY'],
        correctDoc,
      );
      // correctDoc = this.convertDateToString(correctDoc);
      results.push(correctDoc);

      if (nextCount <= newDocuments.length - 1) {
        correctDoc = this.toggleId(newDocuments[nextCount], false) as any;
        correctDoc = await this.invokeEvents(
          POST_KEY,
          ['FIND', 'FIND_MANY'],
          correctDoc,
        );
        // correctDoc = this.convertDateToString(correctDoc);
        results.push(correctDoc);
      }
    }

    // Save to cache
    await this.saveToCache(cacheKey, results);

    return results;
  }

  /**
   * Find records by a list of conditions
   *
   * @param {FindRequest} [req={ conditions: {} }]
   * @returns {Promise<T[]>}
   * @memberof BaseMongoRepository
   */
  async findCursor(
    req: CursorPaginationRequest = {
      conditions: {},
      orderField: 'id',
      order: 1,
    },
  ): Promise<CursorResponse<DOC>> {
    const collection = await this.collection;

    const { args, order, orderField } = req;
    let [endCursor, startCursor] = [null, null];

    let cleanConditions = cleanEmptyProperties({
      tenantId: this.tenant?.tenantId,
      ...req?.conditions,
    });
    cleanConditions = this.toggleId(cleanConditions as any, true) as any;

    const cacheKey = JSON.stringify({ cleanConditions, ...req.args });
    const cachedResult = await this.retrieveFromCache(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }

    const t0 = Date.now();
    let countCursor = 0;

    // console.log(cleanConditions);

    let newDocuments: Cursor | DOC[];
    if (orderField === 'id') {
      const [count, docs] = await Promise.all([
        await collection.estimatedDocumentCount(cleanConditions, {}),
        await this.limitQueryWithId(
          collection,
          cleanConditions,
          order,
          args?.before,
          args?.after,
        ),
      ]);
      newDocuments = docs; // await this.limitQueryWithId(collection, cleanConditions, order, args?.before, args?.after);
      countCursor = count;
    } else {
      const [count, docs] = await Promise.all([
        await collection.estimatedDocumentCount(cleanConditions, {}),
        await this.limitQuery(
          collection,
          cleanConditions,
          orderField,
          order,
          args?.before,
          args?.after,
        ),
      ]);
      newDocuments = docs; // await this.limitQueryWithId(collection, cleanConditions, order, args?.before, args?.after);
      countCursor = count;
    }

    const pageInfo = await this.applyPagination(
      newDocuments,
      args?.first,
      args?.last,
      countCursor,
    );

    newDocuments = await pageInfo.query.toArray();
    const list = [];
    let correctNode;

    // const t1 = Date.now();
    // console.log('Call to doSomething took ' + (t1 - t0) + ' milliseconds.');

    const edges: CursorEdge<DOC>[] = [];
    for (let i = 0; i < newDocuments.length; i += 2) {
      const nextCount = i + 1;

      let curValue = this.toggleId(newDocuments[i], false) as any;
      correctNode = await this.invokeEvents(
        POST_KEY,
        ['FIND', 'FIND_MANY'],
        curValue,
      );

      // correctNode = this.convertDateToString(curValue);
      edges.push({ cursor: curValue.id.toString(), node: correctNode });
      list.push(correctNode);

      if (nextCount <= newDocuments.length - 1) {
        curValue = this.toggleId(newDocuments[nextCount], false) as any;
        correctNode = await this.invokeEvents(
          POST_KEY,
          ['FIND', 'FIND_MANY'],
          curValue,
        );
        // correctNode = this.convertDateToString(curValue);
        edges.push({ cursor: curValue.id.toString(), node: correctNode });
        list.push(correctNode);
      }
    }

    if (list.length > 0) {
      startCursor = list[0]?.id;
      endCursor = list[list.length - 1]?.id;
    }

    const resp: CursorResponse<DOC> = {
      edges,
      list,
      pageInfo: {
        hasNextPage: pageInfo.hasNextPage,
        hasPreviousPage: pageInfo.hasPreviousPage,
        endCursor,
        startCursor,
      },
      totalCount: pageInfo.count,
    };

    if (list.length > 0) {
      // Save to cache
      await this.saveToCache(cacheKey, resp);
    }

    return resp;
  }

  /**
   * Create a document of type T
   *
   * @param {DTO} document
   * @returns {Promise<DOC>}
   * @memberof BaseMongoRepository
   */
  async create(document: Partial<DTO> | DTO): Promise<DOC> {
    const collection = await this.collection;
    const eventResult: Record<string, unknown> = await this.invokeEvents(
      PRE_KEY,
      ['SAVE', 'CREATE'],
      document,
    );

    const tenantFix = { tenantId: this.tenant?.tenantId };
    const cleanDoc = { ...eventResult, ...cleanEmptyProperties(tenantFix) };
    const res = await collection.insertOne(cleanDoc);

    let newDocument = res.ops[0];
    newDocument = this.toggleId(newDocument, false);
    newDocument = await this.invokeEvents(
      POST_KEY,
      ['SAVE', 'CREATE'],
      newDocument,
    );
    // newDocument = this.convertDateToString(newDocument);
    return newDocument;
  }

  /**
   * Save any changes to your document
   *
   * @param {Document} document
   * @returns {Promise<DOC>}
   * @memberof BaseMongoRepository
   */
  async save(document: Document): Promise<DOC> {
    const collection = await this.collection;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const id = new ObjectID(document.id); // flip/flop ids

    const updates = await this.invokeEvents(PRE_KEY, ['SAVE'], document);
    delete updates.id;
    delete updates._id;
    const query = { _id: id };
    const res = await collection.updateOne(
      query as Record<string, unknown>,
      { $set: updates },
      { upsert: true },
    );
    let newDocument = await collection.findOne(
      query as Record<string, unknown>,
    );

    // project new items
    if (newDocument) {
      Object.assign(document, newDocument);
    }

    newDocument.id = id.toString(); // flip flop ids back
    delete newDocument._id;

    newDocument = await this.invokeEvents(POST_KEY, ['SAVE'], newDocument);
    // newDocument = this.convertDateToString(newDocument);
    return newDocument;
  }

  /**
   * Save any changes to your document
   *
   * @returns {Promise<DOC>}
   * @memberof BaseMongoRepository
   * @param documents
   */
  async createMany(documents: Partial<DTO[]> | DTO[]): Promise<DOC[]> {
    const collection = await this.collection;

    const tenantFix = { tenantId: this.tenant?.tenantId };
    const cleanDocs = [];
    documents.map((value) => {
      cleanDocs.push({ ...value, ...cleanEmptyProperties(tenantFix) });
    });

    const res = await collection.insertMany(cleanDocs);

    const newDocuments = res.ops;

    const results = [];
    for (let document of newDocuments) {
      document = this.toggleId(document, false) as any;
      // document = this.convertDateToString(document);
      results.push(document);
    }

    return results;
  }

  /**
   * Find a record by ID and update with new values
   *
   * @param {string} id
   * @param {UpdateByIdRequest} req
   * @returns {Promise<DOC>}
   * @memberof BaseMongoRepository
   */
  async findOneByIdAndUpdate(
    id: string | ObjectID,
    req: UpdateByIdRequest,
  ): Promise<DOC> {
    const entId = typeof id === 'string' ? new ObjectID(id) : id;
    const conditions = cleanEmptyProperties({
      _id: entId,
      tenantId: this.tenant?.tenantId,
    });
    return this.findOneAndUpdate({
      conditions,
      updates: req.updates,
      upsert: req.upsert,
    });
  }

  /**
   * Find a record by ID and update with new values
   *
   * @param {string} id
   * @param {UpdateByIdRequest} req
   * @returns {Promise<DOC>}
   * @memberof BaseMongoRepository
   */
  async findManyAndUpdate(
    req: UpdateRequest,
  ): Promise<{ ok: number; n: number; nModified: number }> {
    const collection = await this.collection;
    const updates = await this.invokeEvents(
      PRE_KEY,
      ['UPDATE', 'UPDATE_ONE'],
      req.updates,
    );

    const conditions = cleanEmptyProperties({
      tenantId: this.tenant?.tenantId,
      ...req.conditions,
    });
    const res = await collection.updateMany(conditions, updates, {
      upsert: req.upsert,
    });

    return res.result;
  }

  /**
   * Find a record and update with new values
   *
   * @param {UpdateRequest} req
   * @returns {Promise<DOC>}
   * @memberof BaseMongoRepository
   */
  async findOneAndUpdate(req: UpdateRequest): Promise<DOC> {
    const collection = await this.collection;
    const updates = await this.invokeEvents(
      PRE_KEY,
      ['UPDATE', 'UPDATE_ONE'],
      req.updates,
    );

    const conditions = cleanEmptyProperties({
      tenantId: this.tenant?.tenantId,
      ...req.conditions,
    });
    const res = await collection.findOneAndUpdate(conditions, updates, {
      upsert: req.upsert,
      returnOriginal: false,
    });

    let document = res.value as any;
    document = this.toggleId(document, false);
    document = await this.invokeEvents(
      POST_KEY,
      ['UPDATE', 'UPDATE_ONE'],
      document,
    );
    // document = this.convertDateToString(document);
    return document;
  }

  /**
   * Delete a record by ID
   *
   * @param {string} id
   * @returns {Promise<DeleteWriteOpResultObject>}
   * @memberof BaseMongoRepository
   */
  async deleteOneById(id: string): Promise<DeleteWriteOpResultObject> {
    const entId = typeof id === 'string' ? new ObjectID(id) : id;
    const conditions = cleanEmptyProperties({
      _id: entId,
      tenantId: this.tenant?.tenantId,
    });
    return this.deleteOne(conditions);
  }

  /**
   * Delete a record
   *
   * @param {*} conditions
   * @returns {Promise<DeleteWriteOpResultObject>}
   * @memberof BaseMongoRepository
   */
  async deleteOne(conditions: any): Promise<DeleteWriteOpResultObject> {
    const collection = await this.collection;
    let cleanConditions = cleanEmptyProperties({
      tenantId: this.tenant?.tenantId,
      ...conditions,
    });
    cleanConditions = this.toggleId(cleanConditions, true) as any;

    await this.invokeEvents(PRE_KEY, ['DELETE', 'DELETE_ONE'], conditions);
    const deleteResult = await collection.deleteOne(cleanConditions);
    await this.invokeEvents(POST_KEY, ['DELETE', 'DELETE_ONE'], deleteResult);

    if (deleteResult?.deletedCount === 0) {
      throw new NotFoundError('Entity not found');
    }

    return deleteResult;
  }

  /**
   * Delete multiple records
   *
   * @param {*} conditions
   * @returns {Promise<any>}
   * @memberof BaseMongoRepository
   */
  async deleteMany(conditions: any): Promise<DeleteWriteOpResultObject> {
    const collection = await this.collection;
    const cleanConditions = cleanEmptyProperties({
      tenantId: this.tenant?.tenantId,
      ...conditions,
    });

    await this.invokeEvents(
      PRE_KEY,
      ['DELETE_ONE', 'DELETE_MANY'],
      cleanConditions,
    );
    const deleteResult = await collection.deleteMany(cleanConditions);
    await this.invokeEvents(
      POST_KEY,
      ['DELETE_ONE', 'DELETE_MANY'],
      deleteResult,
    );

    return deleteResult;
  }

  /**
   * Delete multiple records
   *
   * @param {*} conditions
   * @returns {Promise<any>}
   * @memberof BaseMongoRepository
   */
  public async exist(conditions: any): Promise<boolean> {
    const cleanConditions = cleanEmptyProperties({
      tenantId: this.tenant?.tenantId,
      ...conditions,
    });
    const collection = await this.collection;
    return (await collection.find(cleanConditions).count()) > 0;
  }

  /**
   * Strip off Mongo's ObjectID and replace with string representation or in reverse
   *
   * @private
   * @param {*} document
   * @param {boolean} replace
   * @returns {T}
   * @memberof BaseMongoRepository
   */
  protected toggleId(document: any | any[], replace: boolean): DOC | DOC[] {
    if (Array.isArray(document)) {
      const docs: any[] = [];
      for (const doc of document) {
        if (doc && (doc.id || doc._id)) {
          if (replace) {
            if (typeof doc.id === 'string') {
              doc._id = new ObjectID(doc?.id);
            } else if (typeof doc?.id === 'object') {
              doc._id = new ObjectID(doc?.id.$eq);
            } else {
              doc._id = doc?.id;
            }
            delete doc.id;
          } else {
            doc.id = doc?._id.toString();
            delete doc._id;
          }
        }
        docs.push(doc);
      }
      return docs;
    }

    if (document && (document.id || document._id)) {
      if (replace) {
        if (typeof document?.id === 'string') {
          document._id = new ObjectID(document?.id);
        } else if (typeof document?.id === 'object') {
          document._id = new ObjectID(document?.id.$eq);
        } else {
          document._id = document?.id;
        }
        delete document.id;
      } else {
        document.id = document?._id.toString();
        delete document._id;
      }
    }
    return document;
  }

  /**
   * Return a collection
   * If the collection doesn't exist, it will create it with the given options
   *
   * @private
   * @returns {Promise<Collection<DOC>>}
   * @memberof BaseMongoRepository
   */
  private getCollection(): Promise<Collection<DOC>> {
    return new Promise<Collection<DOC>>(async (resolve, reject) => {
      const db = await this.dbSource.db;
      db.collection(
        this.options.name,
        { strict: true },
        async (err, collection) => {
          let ourCollection = collection;
          if (err) {
            try {
              ourCollection = await db.createCollection(this.options.name, {
                size: this.options.size,
                capped: this.options.capped,
                max: this.options.max,
              });
            } catch (createErr) {
              reject(createErr);
            }
          }

          // assert indexes
          if (this.options.indexes) {
            for (const indexDefinition of this.options.indexes) {
              try {
                await ourCollection.createIndex(
                  indexDefinition.fields,
                  indexDefinition.options,
                );
              } catch (indexErr) {
                if (
                  indexDefinition.overwrite &&
                  indexDefinition.options.name &&
                  indexErr.name === 'MongoError' &&
                  (indexErr.codeName === 'IndexKeySpecsConflict' ||
                    indexErr.codeName === 'IndexOptionsConflict')
                ) {
                  // drop index and recreate
                  try {
                    await ourCollection.dropIndex(indexDefinition.options.name);
                    await ourCollection.createIndex(
                      indexDefinition.fields,
                      indexDefinition.options,
                    );
                  } catch (recreateErr) {
                    reject(recreateErr);
                  }
                } else {
                  reject(indexErr);
                }
              }
            }
          }

          resolve(ourCollection);
        },
      );
    });
  }

  /**
   * Apply functions to a record based on the type of event
   *
   * @private
   * @param {string} type any of the valid types, PRE_KEY POST_KEY
   * @param {string[]} fns any of the valid functions: update, updateOne, save, create, find, findOne, findMany
   * @param {*} document The document to apply functions to
   * @returns {Promise<DOC>}
   * @memberof BaseMongoRepository
   */
  private async invokeEvents(
    type: string,
    fns: DataEvents[],
    document: any | any[],
  ): Promise<any> {
    const test = Reflect.getMetadata('entity', this) || [];
    if (Array.isArray(document)) {
      const docs: any[] = [];
      for (let doc of document) {
        for (const fn of fns) {
          const events = Reflect.getMetadata(`${type}_${fn}`, this) || [];
          for (const event of events) {
            doc = event.bind(this)(document);
            if (doc !== undefined && typeof doc.then === 'function') {
              doc = await doc;
            }
            docs.push(doc);
          }
        }
      }
      return docs;
    }

    for (const fn of fns) {
      const events = Reflect.getMetadata(`${type}_${fn}`, this) || [];
      for (const event of events) {
        document = event.bind(this)(document);
        if (document !== undefined && typeof document.then === 'function') {
          document = await document;
        }
      }
    }

    return document;
  }

  public count() {
    // this._count = count;
    return this;
  }

  public initTenantKeys() {
    // TODO: Initialize tenant data isolation
  }

  public onSave(): { createdAt?: Date; updatedAt?: Date } {
    return {
      createdAt: DateTime.local().toBSON(),
      updatedAt: DateTime.local().toBSON(),
    };
  }

  public onUpdate(): any {
    return {
      $set: {
        updatedAt: DateTime.local().toBSON(),
      },
    };
  }

  private async saveToCache(key: string, data: DOC | any): Promise<DOC | any> {
    if (this.cacheStore) {
      const cacheKey = `${this.options.name}/${key}`;
      await this.cacheStore.set<DOC>(cacheKey, data);
    }
  }

  private async retrieveFromCache(
    key: string,
  ): Promise<DOC | any | DOC[] | CursorResponse<DOC>> {
    if (this.cacheStore) {
      const cacheKey = `${this.options.name}/${key}`;
      const cacheData = await this.cacheStore.get<DOC>(cacheKey);

      if (cacheData !== undefined && typeof cacheData !== 'undefined') {
        return cacheData;
      }
    }
  }

  async applyPagination(
    query: Cursor<DOC>,
    first,
    last,
    count: number,
  ): Promise<{
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    count: number;
    query: Cursor<DOC>;
  }> {
    if (first || last) {
      // const max = await query.clone().hasNext();
      // count = await query.clone().count();
      // console.log(count, max);
      let limit;
      let skip;

      if (first && count > first) {
        limit = first;
      }

      if (last) {
        if (limit && limit > last) {
          skip = limit - last;
          limit = limit - skip;
        } else if (!limit && count > last) {
          skip = count - last;
        }
      }

      if (skip) {
        query.skip(skip);
      }

      if (limit) {
        query.limit(limit);
      }
    }

    return {
      hasNextPage: Boolean(first && count > first),
      hasPreviousPage: Boolean(last && count > last),
      count,
      query,
    };
  }

  async limitQueryWithId(
    query: Collection,
    condition = {},
    order,
    before,
    after,
  ): Promise<Cursor<DOC>> {
    let filter: { _id?: any } = {};

    if (before !== null && before !== undefined) {
      filter = { _id: {} };
      const op = order === 1 ? '$lt' : '$gt';
      filter._id[op] = new ObjectID(before);
    }

    if (after !== null && after !== undefined) {
      filter = { _id: {} };
      const op = order === 1 ? '$gt' : '$lt';
      filter._id[op] = new ObjectID(after);
    }

    const cond = merge(filter, condition);
    return query.find(cond).sort([['_id', order]]);
  }

  async limitQuery(
    query: Collection,
    condition = {},
    field,
    order,
    before,
    after,
  ): Promise<Cursor<DOC>> {
    let filter = {};
    const limits = {};
    const ors = [];
    if (before) {
      const op = order === 1 ? '$lt' : '$gt';
      const beforeObject = await query.findOne(
        {
          _id: new ObjectID(before),
        },
        {
          fields: {
            [field]: 1,
          },
        },
      );
      limits[op] = beforeObject[field];
      ors.push({
        [field]: beforeObject[field],
        _id: { [op]: new ObjectID(before) },
      });
    }

    if (after) {
      const op = order === 1 ? '$gt' : '$lt';
      const afterObject = await query.findOne(
        {
          _id: new ObjectID(after),
        },
        {
          fields: {
            [field]: 1,
          },
        },
      );
      limits[op] = afterObject[field];
      ors.push({
        [field]: afterObject[field],
        _id: { [op]: new ObjectID(after) },
      });
    }

    if (before || after) {
      filter = {
        $or: [
          {
            [field]: limits,
          },
          ...ors,
        ],
      };
    }

    const cond = merge(filter, condition);
    return query.find(cond).sort([
      [field, order],
      ['_id', order],
    ]);
  }

  private convertDateToString(curValue) {
    return {
      ...curValue,
      updatedAt:
        curValue?.updatedAt &&
        moment(curValue?.updatedAt).format('YYYY-MM-DDTHH:mm:ss.SSSSSSSSSZZ'),
      createdAt:
        curValue?.createdAt &&
        moment(curValue?.createdAt).format('YYYY-MM-DDTHH:mm:ss.SSSSSSSSSZZ'),
    };
  }
}
