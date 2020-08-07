import { CACHE_MANAGER, CacheStore, Inject, Injectable } from '@nestjs/common';
import { Db, MongoClient } from 'mongodb';
import {
  BaseMongoRepository,
  Before,
  MongoEntityRepository,
  InjectClient,
  InjectDb,
} from '@juicycleff/repo-orm';
import { merge } from 'lodash';
import { TenantEntity } from '../entities';

@Injectable()
@MongoEntityRepository({
  name: 'tenant',
  indexes: [
    {
      fields: { 'members.email': 1, normalizedName: 1 },
      options: { unique: true, sparse: true },
    },
    {
      fields: { 'members.userId': 1, normalizedName: 1 },
      options: { unique: true, sparse: true },
    },
    {
      fields: { normalizedName: 1 },
      options: { unique: true },
    },
  ],
})
export class TenantRepository extends BaseMongoRepository<TenantEntity> {
  constructor(
    @InjectClient() private readonly dbc: MongoClient,
    @InjectDb() private readonly db: Db,
    @Inject(CACHE_MANAGER) private readonly cache: CacheStore,
  ) {
    super({ client: dbc, db }, cache, null);
  }

  @Before('CREATE')
  private onSaveData(data: Partial<TenantEntity>): Partial<TenantEntity> {
    return {
      ...data,
      ...this.onSave(),
    };
  }

  @Before('UPDATE')
  private onUpdateData(data: Partial<any>) {
    return merge(data, this.onUpdate());
  }
}
