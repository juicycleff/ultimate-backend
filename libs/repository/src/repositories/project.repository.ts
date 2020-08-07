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
import { ProjectEntity } from '../entities';

@Injectable()
@MongoEntityRepository({
  name: 'projects',
})
export class ProjectRepository extends BaseMongoRepository<ProjectEntity> {
  constructor(
    @InjectClient() private readonly dbc: MongoClient,
    @InjectDb() private readonly db: Db,
    @Inject(CACHE_MANAGER) private readonly cache: CacheStore,
  ) {
    super({ client: dbc, db }, cache, null);
  }

  @Before('CREATE')
  private onSaveData(data: Partial<ProjectEntity>): Partial<ProjectEntity> {
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
