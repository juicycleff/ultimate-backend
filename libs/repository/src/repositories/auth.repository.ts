import { Inject, Injectable, CACHE_MANAGER, CacheStore } from '@nestjs/common';
import { Db, MongoClient } from 'mongodb';
import { BaseRepository, EntityRepository, InjectDb, InjectClient, Before } from '@juicycleff/nest-multi-tenant';
import {AuthEntity} from '../entities';
import { generateHashedPassword } from '@graphqlcqrs/common/utils';

@Injectable()
@EntityRepository({
  name: 'authentication',
  indexes: [
    {
      fields: { 'local.email': 1 },
      options: { unique: true},
    },
  ],
})
export class AuthRepository extends BaseRepository<AuthEntity> {
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

  @Before('CREATE')
  private onSaveData(data: Partial<AuthEntity>): Partial<AuthEntity> {
    return {
      ...data,
      local: {
        email: data.local.email,
        hashedPassword: generateHashedPassword(data.local.hashedPassword),
      },
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
