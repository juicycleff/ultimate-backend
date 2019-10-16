import {QueryRunner, Repository, SelectQueryBuilder} from 'typeorm';

export abstract class BaseRepository<T> extends Repository<T> {

  /**
   * @param {string} alias
   *
   * @param queryRunner
   * @returns {SelectQueryBuilder<any>}
   */
  public abstract createQueryBuilder(alias?: string, queryRunner?: QueryRunner): SelectQueryBuilder<T>;
}
