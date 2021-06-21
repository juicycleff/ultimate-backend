import { CACHE_MANAGER, CacheStore, Inject, Injectable } from '@nestjs/common';
import { Db, MongoClient } from 'mongodb';
import { merge } from 'lodash';
import {
  BaseMongoRepository,
  Before,
  MongoEntityRepository,
  InjectClient,
  InjectMongoDB,
  InjectCurrentTenant,
  TenantData,
} from '@juicycleff/repo-orm';
import { WebhookEntity } from '../entities';

@Injectable()
@MongoEntityRepository({
  name: 'webhook',
  indexes: [
    {
      fields: { tenantId: 1 },
      options: { unique: false },
    },
  ],
})
export class WebhookRepository extends BaseMongoRepository<WebhookEntity> {
  constructor(
    @InjectClient() private readonly dbc: MongoClient,
    @InjectMongoDB() private readonly db: Db,
    @Inject(CACHE_MANAGER) private readonly cache: CacheStore,
    @InjectCurrentTenant() private readonly tenantData: TenantData,
  ) {
    super({ client: dbc, db }, cache, null, tenantData);
  }

  @Before('CREATE')
  private onSaveData(data: Partial<WebhookEntity>): Partial<WebhookEntity> {
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
