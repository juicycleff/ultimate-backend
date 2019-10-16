import {EntityRepository, QueryRunner, SelectQueryBuilder} from 'typeorm';
import {GraphqlErrors} from '../../graphql-utils/errors';
import { Paginate } from '../dtos/paginate.dto';
import {UserEntity} from '../entities';
import {BaseRepository} from './base.repository';
import {IUserRepo} from './contracts/user-repo.interface';

@EntityRepository(UserEntity)
export class UserRepository extends BaseRepository<UserEntity> implements IUserRepo {

  createQueryBuilder(alias?: string, queryRunner?: QueryRunner): SelectQueryBuilder<UserEntity> {
    return this.createQueryBuilder()
      .select(alias)
      .cache(true)
      .where(alias + '.deletedAt IS NULL');
  }

  getAll(input: Paginate): Promise<UserEntity[]> {
    return this.createQueryBuilder()
      .limit(input.first)
      .skip(input.offset)
      .cache(true)
      .getMany();
  }

  getByEmail(email: string): Promise<UserEntity> {
    return this.createQueryBuilder()
      .andWhere('c.email = :email')
      .setParameter('email', email)
      .cache(true)
      .getOne()
      .then((user: UserEntity) => {
        if (!user) throw GraphqlErrors.notFoundError('User', email);
        return user;
      });
  }

  getById(id: string): Promise<UserEntity> {
    return this.createQueryBuilder()
      .andWhere('t.id = :id')
      .setParameter('id', id)
      .cache(true)
      .getOne()
      .then((tenant: UserEntity) => {
        if (!tenant) throw GraphqlErrors.notFoundError('User', id);
        return tenant;
      });
  }

  store(userEntity: UserEntity): Promise<UserEntity> {
    return this.save(userEntity);
  }
}
