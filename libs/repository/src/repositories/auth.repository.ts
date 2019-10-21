import { Injectable } from '@nestjs/common';
import {AuthEntity} from '../entities';
import { BaseRepository, EntityRepository, InjectDb, InjectClient } from '@juicycleff/nest-multi-tenant';
import { Db, MongoClient } from 'mongodb';

@Injectable()
@EntityRepository({ name: 'authentication' })
export class AuthRepository extends BaseRepository<AuthEntity> {
  constructor(
    @InjectClient() private readonly dbc: MongoClient,
    @InjectDb() private readonly db: Db,
  ) {
    super({
      client: dbc,
      db,
    });
  }
}
