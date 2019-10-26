import { CACHE_MANAGER, CacheStore, Inject, Injectable } from '@nestjs/common';
import { Db, MongoClient } from 'mongodb';
import { BaseRepository, Before, EntityRepository, InjectClient, InjectDb } from '@juicycleff/nest-multi-tenant';
import { AuthEntity, UserEntity } from '../entities';

@Injectable()
@EntityRepository({
  name: 'user',
  indexes: [
    {
      fields: { email: 1 },
      options: { unique: true},
    },
  ],
})
export class UserRepository extends BaseRepository<UserEntity> {
  constructor(
    @InjectClient() private readonly dbc: MongoClient,
    @InjectDb() private readonly db: Db,
    @Inject(CACHE_MANAGER) private readonly cacheStore: CacheStore,
  ) {
    super({
      client: dbc,
      db,
    }, cacheStore);
  }

  @Before('SAVE', 'CREATE')
  private onSaveData(data: Partial<AuthEntity>): Partial<AuthEntity> {
    return {
      ...data,
      ...this.onSave(),
    };
  }

  @Before('UPDATE')
  private onUpdateData(data: Partial<AuthEntity>) {
    return {
      ...data,
      ...this.onUpdate(),
    };
  }
}
