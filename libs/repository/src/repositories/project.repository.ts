import {EntityRepository, QueryRunner, SelectQueryBuilder} from 'typeorm';
import { Paginate } from '../dtos/paginate.dto';
import {ITenantRepo} from './contracts/project-repo.interface';
import { GraphqlErrors } from '@graphqlcqrs/common/errors';
import { ProjectEntity } from '@graphqlcqrs/repository/entities';
import { BaseRepository } from '@graphqlcqrs/repository/repositories/base.repository';

@EntityRepository(ProjectEntity)
export class ProjectRepository extends BaseRepository<ProjectEntity> implements ITenantRepo {

  getById(id: string): Promise<ProjectEntity> {
    return this.createQueryBuilder()
      .andWhere('t.id = :id')
      .setParameter('id', id)
      .getOne()
      .then((tenant: ProjectEntity) => {
        if (!tenant) { throw GraphqlErrors.notFoundError('Tenant', id); }
        return tenant;
      });
  }

  getAll(input: Paginate): Promise<ProjectEntity[]> {
    return this.createQueryBuilder()
      .limit(input.first)
      .skip(input.offset)
      .getMany();
  }

  getByPath(path: string): Promise<ProjectEntity> {
    return this.createQueryBuilder()
      .andWhere('t.normalizedName = :path')
      .setParameter('path', path)
      .getOne()
      .then((tenant: ProjectEntity) => {
        if (!tenant) { throw GraphqlErrors.notFoundError('Tenant', path); }
        return tenant;
      });
  }

  store(tenant: ProjectEntity): Promise<ProjectEntity> {
    return this.save(tenant);
  }

  createQueryBuilder(alias?: string, queryRunner?: QueryRunner): SelectQueryBuilder<ProjectEntity> {
    return this.createQueryBuilder()
      .select(alias)
      .where(alias + '.deletedAt IS NULL');
  }

}
