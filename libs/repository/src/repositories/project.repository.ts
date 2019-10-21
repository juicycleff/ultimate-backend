import { Injectable } from '@nestjs/common';
import { Db, MongoClient } from 'mongodb';
import { BaseRepository, EntityRepository, InjectClient, InjectDb } from '@juicycleff/nest-multi-tenant';
import { ProjectEntity } from '../entities';

@Injectable()
@EntityRepository({ name: 'project' })
export class ProjectRepository extends BaseRepository<ProjectEntity> {
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
