import { CACHE_MANAGER, CacheStore, Inject, Injectable } from '@nestjs/common';
import { Db, MongoClient } from 'mongodb';
import { merge } from 'lodash';
import { BaseMongoRepository, Before, MongoEntityRepository, InjectClient, InjectDb } from '@juicycleff/repo-orm';
import { OfferEntity } from '../entities';
import { AccessTokenEntity } from '../';

@Injectable()
@MongoEntityRepository({
  name: 'access-token',
  indexes: [
    {
      fields: { token: 1 },
      options: { unique: true },
    },
  ],
})
export class AccessTokenRepository extends BaseMongoRepository<AccessTokenEntity> {
  constructor(
    @InjectClient() private readonly dbc: MongoClient,
    @InjectDb() private readonly db: Db,
    @Inject(CACHE_MANAGER) private readonly cache: CacheStore,
  ) {
    super({ client: dbc, db }, cache, null);
  }

  @Before('CREATE')
  private onSaveData(data: Partial<OfferEntity>): Partial<OfferEntity> {
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
