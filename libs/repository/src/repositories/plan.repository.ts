import { CACHE_MANAGER, CacheStore, Inject, Injectable } from '@nestjs/common';
import { Db, MongoClient } from 'mongodb';
import { merge } from 'lodash';
import {
  BaseMongoRepository,
  Before,
  MongoEntityRepository,
  InjectClient,
  InjectDb,
} from '@juicycleff/repo-orm';
import { PlanEntity } from '../entities';

@Injectable()
@MongoEntityRepository({
  name: 'plan',
  indexes: [
    {
      fields: { normalizedName: 1 },
      options: { unique: true },
    },
    {
      fields: { normalizedName: 1, active: 1, free: 1 },
      options: { unique: false, background: true, sparse: true },
    },
  ],
})
export class PlanRepository extends BaseMongoRepository<PlanEntity> {
  constructor(
    @InjectClient() private readonly dbc: MongoClient,
    @InjectDb() private readonly db: Db,
    @Inject(CACHE_MANAGER) private readonly cache: CacheStore,
  ) {
    super({ client: dbc, db }, cache, null);
  }

  @Before('CREATE')
  private onSaveData(data: Partial<PlanEntity>): Partial<PlanEntity> {
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
