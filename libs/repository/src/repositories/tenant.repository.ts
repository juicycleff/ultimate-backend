import { Injectable } from '@nestjs/common';
import { Db, MongoClient } from 'mongodb';
import { BaseRepository, EntityRepository, InjectClient, InjectDb } from '@juicycleff/nest-multi-tenant';
import { TenantMemberEntity } from '../entities/tenant-member.entity';

@Injectable()
@EntityRepository({ name: 'tenant' })
export class TenantRepository extends BaseRepository<TenantMemberEntity> {
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
