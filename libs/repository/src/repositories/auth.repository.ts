import { Inject, Injectable, CACHE_MANAGER, CacheStore } from '@nestjs/common';
import { Db, MongoClient } from 'mongodb';
import { BaseRepository, EntityRepository, InjectDb, InjectClient, Before } from '@juicycleff/nest-multi-tenant';
import {AuthEntity} from '../entities';
import { generateHashedPassword } from '@graphqlcqrs/common/utils';

@Injectable()
@EntityRepository({ name: 'authentication' })
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

  @Before('SAVE', 'CREATE')
  private onSave(data: Partial<AuthEntity>): Partial<AuthEntity> {
    return {
      ...data,
      local: {
        email: data.local.email,
        hashedPassword: generateHashedPassword(data.local.hashedPassword),
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  @Before('UPDATE')
  private onUpdate(data: Partial<AuthEntity>) {
    return data = {
      updatedAt: new Date().toISOString(),
    };
  }
}
