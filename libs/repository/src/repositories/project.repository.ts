import { CACHE_MANAGER, CacheStore, Inject, Injectable } from '@nestjs/common';
import { Db, MongoClient } from 'mongodb';
import { merge } from 'lodash';
import { BaseRepository, Before, EntityRepository, InjectClient, InjectCurrentTenant, InjectDb, TenantData } from '@juicycleff/nest-multi-tenant';
import { ProjectEntity } from '../entities';

@Injectable()
@EntityRepository({ name: 'project' })
export class ProjectRepository extends BaseRepository<ProjectEntity> {
  constructor(
    @InjectClient() private readonly dbc: MongoClient,
    @InjectDb() private readonly db: Db,
    @Inject(CACHE_MANAGER) private readonly cache: CacheStore,
    @InjectCurrentTenant() private readonly tenantData: TenantData,
  ) {
    super({ client: dbc, db }, cache, null, tenantData);
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
