import { CACHE_MANAGER, CacheStore, Inject, Injectable } from '@nestjs/common';
import { Db, MongoClient } from 'mongodb';
import { merge } from 'lodash';
import { BaseRepository, Before, EntityRepository, InjectClient, InjectDb } from '@juicycleff/nest-multi-tenant';
import { TenantMemberEntity } from '../entities';

@Injectable()
@EntityRepository({
  name: 'tenant-member',
  indexes: [
    {
      fields: { email : 1, tenantId : 1 },
      options: {
        unique: true,
      },
    },
  ],
})
export class TenantMemberRepository extends BaseRepository<TenantMemberEntity> {
  constructor(
    @InjectClient() private readonly dbc: MongoClient,
    @InjectDb() private readonly db: Db,
    @Inject(CACHE_MANAGER) private readonly cacheStore: CacheStore,
  ) {
    super({ client: dbc, db }, cacheStore, null);
  }

  @Before('CREATE')
  private onSaveData(data: Partial<TenantMemberEntity>): Partial<TenantMemberEntity> {
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
