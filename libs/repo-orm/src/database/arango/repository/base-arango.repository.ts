import { DocumentCollection, EdgeCollection } from 'arangojs';
import { CacheStore, Logger } from '@nestjs/common';
import { DateTime } from 'luxon';
import {
  ArangoCollectionProps,
  ArangoDBSource,
  ArangoIndexDefinition,
} from '../interfaces';
import { DataEvents } from '../../../enums';
import {
  COLLECTION_KEY,
  FindRequest,
  POST_KEY,
  PRE_KEY,
  TenantData,
  UpdateByIdRequest,
  UpdateRequest,
} from '../../../interfaces';
import { cleanEmptyProperties } from '@ultimatebackend/common';
import { InsertOptions, UpdateOptions } from 'arangojs/lib/cjs/util/types';
import { aql, AqlQuery } from 'arangojs/lib/cjs/aql-query';
import { ArrayCursor } from 'arangojs/lib/cjs/cursor';
import { QueryOptions } from 'arangojs/lib/cjs/database';
import { ArangoError } from 'arangojs/lib/async/error';
import { GqlArangoParser } from '@juicycleff/repo-orm/utils/arango-parser.utils';

// that class only can be extended
export class BaseArangoRepository<DOC, DTO = DOC> {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  collection: Promise<DocumentCollection<DOC> | EdgeCollection<DOC>>;
  readonly options: ArangoCollectionProps;
  readonly tenant: TenantData;
  readonly cacheStore: CacheStore;
  logger = new Logger(this.constructor.name);

  /**
   * Creates an instance of BaseMongoRepository.
   * @param {DBSource} dbSource Your MongoDB connection
   * @param cacheStore
   * @param opts
   * @param tenantData
   * @memberof BaseMongoRepository
   */
  constructor(
    public dbSource: ArangoDBSource,
    cacheStore?: CacheStore,
    opts?: ArangoCollectionProps,
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
    const condition = { _key: id, tenantId: this.tenant?.tenantId };
    // const cleanConditions = cleanEmptyProperties(condition);
    // const prunedConditions = this.toggleId(cleanConditions, true) as any;

    const cacheKey = JSON.stringify(id);
    const cachedResult = await this.retrieveFromCache(cacheKey);
    if (!Array.isArray(cachedResult)) {
      return cachedResult;
    }

    let document = await this.runOneByIdQuery(id, {
      toObject: true,
    });
    if (document) {
      document = this.toggleId(document, false) as any;
      document = await this.invokeEvents(POST_KEY, ['FIND_ONE'], document);
      await this.saveToCache(cacheKey, document);
      return document;
    }
  }

  /**
   * Find multiple documents by a list of ids
   *
   * @param {string[]} ids
   * @returns {Promise<T[]>}
   * @memberof BaseMongoRepository
   */
  async findManyById(ids: string[]): Promise<DOC[]> {
    const query = { _key: { $in: ids.map((id) => id) } };

    const cacheKey = JSON.stringify(query);
    const cachedResult = await this.retrieveFromCache(cacheKey);
    if (Array.isArray(cachedResult)) {
      return cachedResult;
    }

    const found = await this.runManyByIdQuery(ids);

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
   * @returns {Promise<DOC>}
   * @memberof BaseMongoRepository
   */
  async findOne(conditions: Record<string, unknown>): Promise<DOC> {
    try {
      const cleanConditions = cleanEmptyProperties({
        ...conditions,
        tenantId: this.tenant?.tenantId,
      });
      const prunedConditions = this.toggleId(cleanConditions, true) as any;

      const cacheKey = JSON.stringify(prunedConditions);
      const cachedResult = await this.retrieveFromCache(cacheKey);
      if (cachedResult && !Array.isArray(cachedResult)) {
        return cachedResult;
      }

      let document = await this.runFindQuery(prunedConditions, {
        toObject: true,
      });

      if (document) {
        document = this.toggleId(document, false) as any;
        document = await this.invokeEvents(
          POST_KEY,
          ['FIND', 'FIND_ONE'],
          document,
        );
        await this.saveToCache(cacheKey, document);
        return document;
      }
    } catch (e) {
      console.log(e);
      if (e instanceof ArangoError) {
        if (e?.isArangoError) {
          switch (e.errorNum) {
            case 1210:
              console.log(e);
              throw new Error('Unique constraint not met');
            default:
              throw new Error(e?.response?.body);
          }
        }
      }
      throw e;
    }
  }

  /**
   * Finds a record by a list of conditions
   *
   * @returns {Promise<DOC>}
   * @memberof BaseMongoRepository
   * @param q
   * @param bindVars
   * @param opts
   */
  async query(q: string | AqlQuery, opts?: QueryOptions): Promise<ArrayCursor> {
    const db = await this.dbSource.db;

    // const cacheKey = JSON.stringify(q);
    // const cachedResult = await this.retrieveFromCache(cacheKey);
    // if (cachedResult) {
    // return cachedResult as any;
    // }

    let result;
    if (typeof q === 'string') {
      result = await db.query(q, opts);
    } else {
      result = await db.query(q, opts);
    }

    // await this.saveToCache(cacheKey, result);
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
      ...req.conditions,
      tenantId: this.tenant?.tenantId,
    });
    const conditions = this.toggleId(cleanConditions as any, true) as any;

    const cacheKey = JSON.stringify(conditions) + JSON.stringify(req);
    const cachedResult = await this.retrieveFromCache(cacheKey);
    if (Array.isArray(cachedResult)) {
      return cachedResult;
    }

    let cursor = await collection.firstExample(conditions);

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

    for (let document of newDocuments) {
      document = this.toggleId(document, false) as any;
      document = await this.invokeEvents(
        POST_KEY,
        ['FIND', 'FIND_MANY'],
        document,
      );
      results.push(document);
    }

    // Save to cache
    await this.saveToCache(cacheKey, results);

    return results;
  }

  /**
   * Create a document of type T
   *
   * @param {DTO} document
   * @param opts
   * @returns {Promise<DOC>}
   * @memberof BaseMongoRepository
   */
  async create(
    document: Partial<DTO> | DTO,
    noClean?: boolean,
    opts?: InsertOptions,
  ): Promise<DOC> {
    try {
      const collection = await this.collection;
      const eventResult: Record<string, unknown> = await this.invokeEvents(
        PRE_KEY,
        ['SAVE', 'CREATE'],
        document,
      );

      const cleanDoc = noClean
        ? {
            ...eventResult,
            tenantId: this.tenant?.tenantId,
          }
        : cleanEmptyProperties({
            ...eventResult,
            tenantId: this.tenant?.tenantId,
          });

      let newDocument = await collection.save(cleanDoc, {
        ...opts,
        returnNew: true,
      });

      newDocument = this.toggleId(newDocument?.new, false);
      newDocument = await this.invokeEvents(
        POST_KEY,
        ['SAVE', 'CREATE'],
        newDocument,
      );

      return newDocument;
    } catch (e) {
      if (e instanceof ArangoError) {
        if (e?.isArangoError) {
          switch (e.errorNum) {
            case 1210:
              throw new Error('Unique constraint not met');
            default:
              throw new Error(e?.response?.body);
          }
        }
      }
      throw e;
    }
  }

  /**
   * Create a document of type T
   *
   * @param {DTO} document
   * @param _from
   * @param _to
   * @param opts
   * @returns {Promise<DOC>}
   * @memberof BaseMongoRepository
   */
  // tslint:disable-next-line:variable-name
  async createEdge(
    document: Partial<DTO> | DTO,
    _from: string,
    _to: string,
    opts?: InsertOptions,
  ): Promise<DOC> {
    const collection = (await this.collection) as EdgeCollection;
    const eventResult: Record<string, unknown> = await this.invokeEvents(
      PRE_KEY,
      ['SAVE', 'CREATE'],
      document,
    );

    const cleanDoc = cleanEmptyProperties({
      ...eventResult,
      tenantId: this.tenant?.tenantId,
    });
    let newDocument = await collection.save(cleanDoc, _from, _to, {
      ...opts,
      returnNew: true,
    });

    newDocument = this.toggleId(newDocument, false);
    newDocument = await this.invokeEvents(
      POST_KEY,
      ['SAVE', 'CREATE'],
      newDocument,
    );

    return newDocument;
  }

  /**
   * Save any changes to your document
   *
   * @param {Document} document
   * @param options
   * @returns {Promise<DOC>}
   * @memberof BaseMongoRepository
   */
  async save(document: Document, options?: UpdateOptions): Promise<DOC> {
    const collection = await this.collection;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const id = document.id; // flip/flop ids

    const updates = await this.invokeEvents(PRE_KEY, ['SAVE'], document);
    delete updates.id;
    delete updates._key;
    const query = { _key: id };
    let newDocument = await collection.update(query, updates, {
      ...options,
      overwrite: true,
      returnNew: true,
    });

    // project new items
    if (newDocument) {
      Object.assign(document, newDocument);
    }

    newDocument.id = id; // flip flop ids back
    delete newDocument._key;

    newDocument = await this.invokeEvents(POST_KEY, ['SAVE'], newDocument);
    return newDocument;
  }

  /**
   * Save any changes to your document
   *
   * @returns {Promise<DOC>}
   * @memberof BaseMongoRepository
   * @param documents
   * @param opts
   */
  async createMany(
    documents: Partial<DTO[]> | DTO[],
    opts?: InsertOptions,
  ): Promise<DOC[]> {
    const collection = await this.collection;

    const unSavedDocs = [];
    for (const document of documents) {
      const eventResult: Record<string, unknown> = await this.invokeEvents(
        PRE_KEY,
        ['SAVE', 'CREATE'],
        document,
      );

      const cleanDoc = cleanEmptyProperties({
        ...eventResult,
        tenantId: this.tenant?.tenantId,
      });
      unSavedDocs.push(cleanDoc);
    }

    let newDocuments = await collection.save(unSavedDocs, {
      ...opts,
      returnNew: true,
    });
    newDocuments = this.toggleId(newDocuments, false);
    newDocuments = await this.invokeEvents(
      POST_KEY,
      ['SAVE', 'CREATE'],
      newDocuments,
    );

    return newDocuments;
  }

  /**
   * Find a record by ID and update with new values
   *
   * @param {string} id
   * @param {UpdateByIdRequest} req
   * @returns {Promise<DOC>}
   * @memberof BaseMongoRepository
   */
  async findOneByIdAndUpdate(id: string, req: UpdateByIdRequest): Promise<DOC> {
    const conditions = cleanEmptyProperties({
      _key: id,
      tenantId: this.tenant?.tenantId,
    });
    return this.findOneAndUpdate({
      conditions,
      updates: req.updates,
      upsert: req.upsert,
    });
  }

  /**
   * Find a record and update with new values
   *
   * @param {UpdateRequest} req
   * @returns {Promise<DOC>}
   * @memberof BaseMongoRepository
   */
  async findOneAndUpdate(
    req: UpdateRequest,
    cleanEmpty?: boolean,
  ): Promise<DOC> {
    const updates = await this.invokeEvents(
      PRE_KEY,
      ['UPDATE', 'UPDATE_ONE'],
      req.updates,
    );

    let conditions = {
      ...req.conditions,
      tenantId: this.tenant?.tenantId,
    };

    if (cleanEmpty) {
      conditions = cleanEmptyProperties(conditions);
    }
    const res = await this.runUpdateOneQuery(conditions, updates);

    let document = res.after as any;
    document = this.toggleId(document, false);
    document = await this.invokeEvents(
      POST_KEY,
      ['UPDATE', 'UPDATE_ONE'],
      document,
    );
    return document;
  }

  /**
   * Delete a record by ID
   *
   * @param {string} id
   * @returns {Promise<DeleteWriteOpResultObject>}
   * @memberof BaseMongoRepository
   */
  async deleteOneById(id: string): Promise<DOC> {
    const collection = await this.collection;
    const conditions = cleanEmptyProperties({
      _key: id,
      tenantId: this.tenant?.tenantId,
    });
    return await collection.removeByExample(conditions);
  }

  /**
   * Delete a record
   *
   * @param {*} conditions
   * @returns {Promise<DeleteWriteOpResultObject>}
   * @memberof BaseMongoRepository
   */
  async deleteOne(conditions: any): Promise<DOC> {
    const collection = await this.collection;
    const cleanConditions = cleanEmptyProperties({
      ...conditions,
      tenantId: this.tenant?.tenantId,
    });

    await this.invokeEvents(PRE_KEY, ['DELETE', 'DELETE_ONE'], conditions);
    const deleteResult = await collection.removeByExample(cleanConditions);
    await this.invokeEvents(POST_KEY, ['DELETE', 'DELETE_ONE'], deleteResult);

    return deleteResult;
  }

  /**
   * Delete multiple records
   *
   * @param {*} conditions
   * @returns {Promise<any>}
   * @memberof BaseMongoRepository
   */
  async deleteMany(conditions: any): Promise<DOC[]> {
    const collection = await this.collection;
    const cleanConditions = cleanEmptyProperties({
      ...conditions,
      tenantId: this.tenant?.tenantId,
    });

    await this.invokeEvents(
      PRE_KEY,
      ['DELETE_ONE', 'DELETE_MANY'],
      cleanConditions,
    );
    const deleteResult = await collection.removeByExample(cleanConditions);
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
    const result = await this.findOne(conditions);
    if (result) return true;
    return false;
  }

  /**
   * Delete multiple records
   *
   * @returns {Promise<any>}
   * @memberof BaseRavenRepository
   * @param key
   */
  public async documentExist(key: string): Promise<boolean> {
    const collection = await this.collection;
    return await collection.documentExists(key);
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
        if (doc && (doc.id || doc._key)) {
          if (replace) {
            doc._key = doc.id;
            delete doc.id;
          } else {
            doc.id = doc._key;
            delete doc._key;
          }
        }
        docs.push(doc);
      }
      return docs;
    }

    if (document && (document.id || document._key)) {
      if (replace) {
        document._key = document.id;
        delete document.id;
      } else {
        document.id = document._key;
        delete document._key;
      }
    }
    return document;
  }

  protected swapIdKey(filter: string): string {
    return filter.replace('id', '_key');
  }

  /**
   * Return a collection
   * If the collection doesn't exist, it will create it with the given options
   *
   * @private
   * @returns {Promise<Collection<DOC>>}
   * @memberof BaseMongoRepository
   */
  private async getCollection(): Promise<
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    DocumentCollection<DOC> | EdgeCollection<DOC>
  > {
    const db = await this.dbSource.db;

    if (!this.options.edgeType) {
      const ourCollection = await db.collection(this.options.name);
      const exists = await ourCollection.exists();

      if (!exists) {
        this.logger.log('create document collection => ' + this.options.name);
        await ourCollection.create();
      }

      if (this.options.indexes) {
        for (const indexDefinition of this.options.indexes) {
          try {
            await this.ensureIndex(indexDefinition, ourCollection);
          } catch (indexErr) {
            if (
              this.options.overwrite &&
              this.options.name &&
              indexErr.name === 'MongoError' &&
              (indexErr.codeName === 'IndexKeySpecsConflict' ||
                indexErr.codeName === 'IndexOptionsConflict')
            ) {
              // drop index and recreate
              try {
                await ourCollection.dropIndex(indexDefinition.opts.name);
                await this.ensureIndex(indexDefinition, ourCollection);
              } catch (recreateErr) {
                this.logger.error(recreateErr);
              }
            } else {
              this.logger.error(indexErr);
            }
          }
        }
      }

      return ourCollection;
    } else {
      const ourCollection = await db.edgeCollection(this.options.name);
      const exists = await ourCollection.exists();

      if (!exists) {
        this.logger.log(
          'create document edge collection => ' + this.options.name,
        );
        await ourCollection.create();
      }

      if (this.options.indexes) {
        for (const indexDefinition of this.options.indexes) {
          try {
            await this.ensureIndex(indexDefinition, ourCollection);
          } catch (indexErr) {
            if (
              this.options.overwrite &&
              this.options.name &&
              indexErr.name === 'MongoError' &&
              (indexErr.codeName === 'IndexKeySpecsConflict' ||
                indexErr.codeName === 'IndexOptionsConflict')
            ) {
              // drop index and recreate
              try {
                await ourCollection.dropIndex(indexDefinition.opts.name);
                await this.ensureIndex(indexDefinition, ourCollection);
              } catch (recreateErr) {
                this.logger.error(recreateErr);
              }
            } else {
              this.logger.error(indexErr);
            }
          }
        }
      }
      return ourCollection;
    }
  }

  async ensureIndex(
    indexDefinition: ArangoIndexDefinition,
    ourCollection: DocumentCollection | EdgeCollection,
  ) {
    if (indexDefinition.type === 'hash') {
      await ourCollection.createHashIndex(
        indexDefinition.fields,
        indexDefinition.opts,
      );
    } else if (indexDefinition.type === 'fulltext') {
      await ourCollection.createFulltextIndex(
        indexDefinition.fields,
        indexDefinition.minLength,
      );
    } else if (indexDefinition.type === 'geo') {
      await ourCollection.createGeoIndex(
        indexDefinition.fields,
        indexDefinition.opts,
      );
    } else if (indexDefinition.type === 'persistent') {
      await ourCollection.createPersistentIndex(
        indexDefinition.fields,
        indexDefinition.opts,
      );
    } else if (indexDefinition.type === 'skiplist') {
      await ourCollection.createSkipList(
        indexDefinition.fields,
        indexDefinition.opts,
      );
    } else {
      await ourCollection.ensureIndex(indexDefinition);
    }
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
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    };
  }

  public onUpdate(): any {
    return {
      updatedAt: DateTime.local(),
    };
  }

  private async saveToCache(key: string, data: DOC | any): Promise<DOC | any> {
    if (this.cacheStore) {
      const cacheKey = `${this.options.name}/${key}`;
      await this.cacheStore.set<DOC>(cacheKey, data);
    }
  }

  private async runFindQuery(
    conditions: any,
    options?: QueryArgsOptions,
  ): Promise<DOC | any | DOC[]> {
    try {
      const db = await this.dbSource.db;
      const query = this.parseFindQuery(
        GqlArangoParser(conditions, 'doc', true),
      );

      const cursor = await db.query(query, {
        count: options.count,
        batchSize: options.limit || 50,
        cache: options.cache,
      });

      if (options.toObject) {
        return (await cursor.next()) as DOC;
      } else {
        if (await cursor.hasNext()) {
          return (await cursor.nextBatch()) as DOC[];
        }
      }
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  private async runUpdateOneQuery(
    conditions: any,
    payload: Record<string, any>,
  ): Promise<{ after: DOC; before: DOC }> {
    const db = await this.dbSource.db;

    const query = this.parseUpdateOneQuery(
      GqlArangoParser(conditions, 'doc', false),
      payload,
    );

    const cursor = await db.query(query, {
      cache: true,
    });

    try {
      return (await cursor.next()) as { after: DOC; before: DOC };
    } catch (e) {
      throw e;
    }
  }

  private async runOneQuery(
    conditions: any,
    options?: QueryArgsOptions,
  ): Promise<DOC | any | DOC[]> {
    const db = await this.dbSource.db;
    const query = this.parseOneQuery(GqlArangoParser(conditions, 'doc', true));

    const cursor = await db.query(query, {
      count: options.count,
      batchSize: options.limit || 50,
      cache: options.cache,
    });

    if (options.toObject) {
      return (await cursor.next()) as DOC;
    } else {
      if (await cursor.hasNext()) {
        return (await cursor.nextBatch()) as DOC[];
      }
    }
  }

  private async runOneByIdQuery(
    conditions: any,
    options?: QueryArgsOptions,
  ): Promise<DOC | any | DOC[]> {
    const db = await this.dbSource.db;
    const query = this.parseOneQuery(conditions);

    const cursor = await db.query(query, {
      count: options.count,
      batchSize: options.limit || 50,
      cache: options.cache,
    });

    if (options.toObject) {
      return (await cursor.next()) as DOC;
    } else {
      if (await cursor.hasNext()) {
        return (await cursor.nextBatch()) as DOC[];
      }
    }
  }

  private async runManyByIdQuery(
    ids: any,
    options?: QueryArgsOptions,
  ): Promise<DOC | any | DOC[]> {
    const db = await this.dbSource.db;
    const query = this.parseFindQuery(`doc._key IN ${ids}`);

    const cursor = await db.query(query, {
      count: options.count,
      batchSize: options.limit || 50,
      cache: options.cache,
    });

    if (options.toObject) {
      return (await cursor.next()) as DOC;
    } else {
      if (await cursor.hasNext()) {
        return (await cursor.nextBatch()) as DOC[];
      }
    }
  }

  private parseFindQuery(query?: string): AqlQuery {
    if (query) {
      return {
        query: `
          FOR doc IN @@collection
            FILTER ${query}
            RETURN doc
        `,
        bindVars: {
          '@collection': this.options.name,
        },
      };
    }

    return {
      query: `
          FOR doc IN @@collection
            RETURN doc
        `,
      bindVars: {
        '@collection': this.options.name,
      },
    };
  }

  private parseUpdateOneQuery(
    query: string,
    obj: Record<string, any>,
  ): AqlQuery {
    if (query) {
      return {
        query: `
          FOR doc IN @@collection
            FILTER ${query}
            UPDATE doc WITH ${JSON.stringify(obj).replace(
              /"([^"]+)":/g,
              '$1:',
            )} IN @@collection
            RETURN { before: OLD, after: NEW }
        `,
        bindVars: {
          '@collection': this.options.name,
        },
      };
    }

    return {
      query: `
          FOR doc IN @@collection
            RETURN doc
        `,
      bindVars: {
        '@collection': this.options.name,
      },
    };
  }

  private parseOneQueryByID(query: string): AqlQuery {
    if (!query) {
      return null;
    }

    return aql`RETURN DOCUMENT(${this.options.name.toLowerCase()}, ${query})`;
  }

  private parseOneQuery(query: string): AqlQuery {
    if (!query) {
      return null;
    }

    return {
      query: `
          FOR doc IN @@collection
            FILTER ${query}
            RETURN doc
        `,
      bindVars: {
        '@collection': this.options.name,
      },
    };
  }

  private parseDeleteQuery(query: string): AqlQuery {
    if (!query) {
      return null;
    }

    return aql`
      FOR doc IN ${this.options.name}
        REPLACE doc._key
        WITH { replaced: true }
        OPTIONS { exclusive: true }
        RETURN OLD
    `;
  }

  private async retrieveFromCache(key: string): Promise<DOC | any | DOC[]> {
    if (this.cacheStore) {
      const cacheKey = `${this.options.name}/${key}`;
      const cacheData = await this.cacheStore.get<DOC>(cacheKey);

      if (cacheData !== undefined && typeof cacheData !== 'undefined') {
        return cacheData;
      }
    }
  }
}

interface QueryArgsOptions {
  toObject?: boolean;
  returnNew?: boolean;
  count?: boolean;
  cache?: boolean;
  limit?: number;
}
