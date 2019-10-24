import { Injectable } from '@nestjs/common';
import { Db, MongoClient } from 'mongodb';
import { BaseRepository, EntityRepository, InjectClient, InjectDb } from '@juicycleff/nest-multi-tenant';
import { ProjectEntity, TenantMemberEntity } from '../entities';

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
    @InjectClient() private readonly client: MongoClient,
    @InjectDb() private readonly db: Db,
  ) {
    super({
      client,
      db,
    });
  }
}
