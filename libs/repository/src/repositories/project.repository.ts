import { ProjectEntity } from '../entities';
import { BaseRepository, EntityRepository } from '@juicycleff/nest-multi-tenant';
import { Injectable } from '@nestjs/common';

@Injectable()
@EntityRepository({
  name: 'project',
  capped: true,
  size: 10000,
})
export class ProjectRepository extends BaseRepository<ProjectEntity> {}
