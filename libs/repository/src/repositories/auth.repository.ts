import {EntityRepository, QueryRunner, SelectQueryBuilder} from 'typeorm';
import {AuthEntity} from '../entities';
import { LocalAuth } from '@graphqlcqrs/repository/entities/embeded/social';
import { BaseRepository } from '@graphqlcqrs/repository/repositories/base.repository';
import { IAuthRepo } from '@graphqlcqrs/repository/repositories/contracts/auth-repo.interface';

@EntityRepository(AuthEntity)
export class AuthRepository extends BaseRepository<AuthEntity> implements IAuthRepo {

  createQueryBuilder(alias?: string, queryRunner?: QueryRunner): SelectQueryBuilder<AuthEntity> {
    return this.createQueryBuilder()
      .select(alias)
      .where(alias + '.deletedAt IS NULL');
  }

  async getByLocal(local: LocalAuth): Promise<AuthEntity> {
    return  await this.findOne({
      where: {
        local,
      },
      cache: true,
    });
  }

  async exist(local: LocalAuth): Promise<boolean> {
    const result = await this.findOne({
      where: {
        local,
      },
    });

    return !!(result && result.id);
  }

  store(authEntity: AuthEntity): Promise<AuthEntity> {
    return this.save(authEntity);
  }
}
