import { CACHE_MANAGER, CacheStore, Inject, Injectable } from '@nestjs/common';
import { Db, MongoClient } from 'mongodb';
import { BaseRepository, Before, EntityRepository, InjectClient, InjectDb } from '@juicycleff/nest-multi-tenant';
import { merge } from 'lodash';
import { TenantEntity } from '../entities';

@Injectable()
@EntityRepository({ name: 'tenant' })
export class TenantRepository extends BaseRepository<TenantEntity> {
  constructor(
    @InjectClient() private readonly dbc: MongoClient,
    @InjectDb() private readonly db: Db,
    @Inject(CACHE_MANAGER) private readonly cacheStore: CacheStore,
  ) {
    super({ client: dbc, db }, cacheStore, null);
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
