import { Collection, CollectionAggregationOptions, DeleteWriteOpResultObject, ObjectID, AggregationCursor } from 'mongodb';
import { CacheStore } from '@nestjs/common';
import { MongoCollectionProps, MongoDBSource } from '../interfaces';
import { DataEvents } from '@juicycleff/nest-multi-tenant/enums';
import { COLLECTION_KEY, TenantData, FindRequest, POST_KEY, PRE_KEY, UpdateByIdRequest, UpdateRequest } from '@juicycleff/nest-multi-tenant/interfaces';
import { cleanEmptyProperties } from '@graphqlcqrs/common';

// that class only can be extended
export class BaseMongoRepository <DOC, DTO = DOC> {
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
  constructor(public dbSource: MongoDBSource, cacheStore?: CacheStore, opts?: MongoCollectionProps, tenantData?: TenantData) {
    this.options = Object.assign({}, opts, Reflect.getMetadata(COLLECTION_KEY, this));
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
    const condition = { _id: new ObjectID(id), tenantId: this.tenant?.tenantId };
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
    const query = { _id: { $in: ids.map(id => new ObjectID(id)) } };

    const cacheKey = JSON.stringify(query);
    const cachedResult = await this.retrieveFromCache(cacheKey);
    if (Array.isArray(cachedResult)) {
      return cachedResult;
    }

    const found = await collection.find(query as object).toArray();

    const results: DOC[] = [];
    for (const result of found) {
      results.push(await this.invokeEvents(POST_KEY, ['FIND', 'FIND_MANY'], this.toggleId(result, false)));
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
  async findOne(conditions: object, noCache = false): Promise<DOC> {
    const collection = await this.collection;

    const cleanConditions = cleanEmptyProperties({ ...conditions, tenantId: this.tenant?.tenantId });
    const prunedConditions = this.toggleId(cleanConditions, true) as any;

    const cacheKey = JSON.stringify(prunedConditions);

    if (noCache === false) {
      const cachedResult = await this.retrieveFromCache(cacheKey);
      if (cachedResult !== null && cachedResult !== undefined && !Array.isArray(cachedResult)) {
        return cachedResult;
      }
    }

    let document = await collection.findOne(prunedConditions);
    if (document) {
      document = this.toggleId(document, false) as any;
      document = await this.invokeEvents(POST_KEY, ['FIND', 'FIND_ONE'], document);
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
  async aggregate(pipeline?: object[], options?: CollectionAggregationOptions)
    : Promise<AggregationCursor<DOC> | AggregationCursor<DOC[]> | AggregationCursor<any>> {
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

    const cleanConditions = cleanEmptyProperties({ ...req.conditions, tenantId: this.tenant?.tenantId });
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

    for (let document of newDocuments) {
      document = this.toggleId(document, false) as any;
      document = await this.invokeEvents(POST_KEY, ['FIND', 'FIND_MANY'], document);
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
   * @returns {Promise<DOC>}
   * @memberof BaseMongoRepository
   */
  async create(document: Partial<DTO> | DTO): Promise<DOC> {
    const collection = await this.collection;
    const eventResult: unknown = await this.invokeEvents(PRE_KEY, ['SAVE', 'CREATE'], document);
    // @ts-ignore
    const cleanDoc = cleanEmptyProperties({ ...eventResult, tenantId: this.tenant?.tenantId });
    const res = await collection.insertOne(cleanDoc);

    let newDocument = res.ops[0];
    // @ts-ignore
    newDocument = this.toggleId(newDocument, false);
    newDocument = await this.invokeEvents(POST_KEY, ['SAVE', 'CREATE'], newDocument);
    // @ts-ignore
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

    // @ts-ignore
    const id = new ObjectID(document.id);  // flip/flop ids

    const updates = await this.invokeEvents(PRE_KEY, ['SAVE'], document);
    delete updates.id;
    delete updates._id;
    const query = { _id: id };
    const res = await collection.updateOne(query as object, { $set: updates }, { upsert: true });
    let newDocument = await collection.findOne(query as object);

    // project new items
    if (newDocument) {
      Object.assign(document, newDocument);
    }

    // @ts-ignore
    newDocument.id = id.toString(); // flip flop ids back
    // @ts-ignore
    delete newDocument._id;

    newDocument = await this.invokeEvents(POST_KEY, ['SAVE'], newDocument);
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
    const eventResult: unknown = await this.invokeEvents(PRE_KEY, ['SAVE', 'CREATE'], documents);

    // @ts-ignore
    const res = await collection.insertMany(eventResult);

    let newDocuments = res.ops[0];
    // @ts-ignore
    newDocuments = this.toggleId(newDocument, false);
    newDocuments = await this.invokeEvents(POST_KEY, ['SAVE', 'CREATE'], newDocuments);

    // @ts-ignore
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
  async findOneByIdAndUpdate(id: string | ObjectID, req: UpdateByIdRequest): Promise<DOC> {
    const entId = typeof id === 'string' ? new ObjectID(id) : id;
    const conditions = cleanEmptyProperties({ _id: entId, tenantId: this.tenant?.tenantId });
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
  async findOneAndUpdate(req: UpdateRequest): Promise<DOC> {
    const collection = await this.collection;
    const updates = await this.invokeEvents(PRE_KEY, ['UPDATE', 'UPDATE_ONE'], req.updates);

    const conditions = cleanEmptyProperties({ ...req.conditions, tenantId: this.tenant?.tenantId });
    const res = await collection.findOneAndUpdate(conditions, updates, {
      upsert: req.upsert,
      returnOriginal: false,
    });

    let document = res.value as any;
    document = this.toggleId(document, false);
    document = await this.invokeEvents(POST_KEY, ['UPDATE', 'UPDATE_ONE'], document);
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
    const conditions = cleanEmptyProperties({ _id: entId, tenantId: this.tenant?.tenantId });
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
    const cleanConditions = cleanEmptyProperties({ ...conditions, tenantId: this.tenant?.tenantId });

    await this.invokeEvents(PRE_KEY, ['DELETE', 'DELETE_ONE'], conditions);
    const deleteResult = await collection.deleteOne(cleanConditions);
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
  async deleteMany(conditions: any): Promise<DeleteWriteOpResultObject> {
    const collection = await this.collection;
    const cleanConditions = cleanEmptyProperties({ ...conditions, tenantId: this.tenant?.tenantId });

    await this.invokeEvents(PRE_KEY, ['DELETE_ONE', 'DELETE_MANY'], cleanConditions);
    const deleteResult = await collection.deleteMany(cleanConditions);
    await this.invokeEvents(POST_KEY, ['DELETE_ONE', 'DELETE_MANY'], deleteResult);

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
    const cleanConditions = cleanEmptyProperties({ ...conditions, tenantId: this.tenant?.tenantId });
    const collection = await this.collection;
    return await collection.find(cleanConditions).count() > 0;
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
              doc._id = new ObjectID(doc.id);
            } else if (typeof doc.id === 'object') {
              doc._id = new ObjectID(doc.id.$eq);
            } else {
              doc._id =  doc.id;
            }
            delete doc.id;
          } else {
            doc.id = doc._id.toString();
            delete doc._id;
          }
        }
        docs.push(doc);
      }
      return docs;
    }

    if (document && (document.id || document._id)) {
      if (replace) {
        if (typeof document.id === 'string') {
          document._id = new ObjectID(document.id);
        } else if (typeof document.id === 'object') {
          document._id = new ObjectID(document.id.$eq);
        } else {
          document._id =  document.id;
        }
        delete document.id;
      } else {
        document.id = document._id.toString();
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
      db.collection(this.options.name, { strict: true }, async (err, collection) => {
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
              await ourCollection.createIndex(indexDefinition.fields, indexDefinition.options);
            } catch (indexErr) {
              if (
                indexDefinition.overwrite &&
                indexDefinition.options.name &&
                indexErr.name === 'MongoError' &&
                (indexErr.codeName === 'IndexKeySpecsConflict' || indexErr.codeName === 'IndexOptionsConflict')
              ) {
                // drop index and recreate
                try {
                  await ourCollection.dropIndex(indexDefinition.options.name);
                  await ourCollection.createIndex(indexDefinition.fields, indexDefinition.options);
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
      });
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
  private async invokeEvents(type: string, fns: DataEvents[], document: any | any[]): Promise<any> {
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

  public onSave(): { createdAt: string; updatedAt: string } {
    return {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  public onUpdate(): any {
    return {
      $set: {
        updatedAt: new Date().toISOString(),
      },
    };
  }

  private async saveToCache(key: string, data: DOC | any): Promise<DOC|any> {
    if (this.cacheStore) {
      const cacheKey = `${this.options.name}/${key}`;
      await this.cacheStore.set<DOC>(cacheKey, data);
    }
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
