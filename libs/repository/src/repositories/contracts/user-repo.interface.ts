// @ts-ignore
import { Paginate } from '../../dtos/paginate.dto';
import {UserEntity, ProjectEntity} from '../../entities';

export interface IUserRepo {

  /**
   * @returns {Promise<UserEntity>}
   * @param id {string}
   */
  getById(id: string): Promise<UserEntity>;

  /**
   * @returns {Promise<UserEntity>}
   * @param email
   */
  getByEmail(email: string): Promise<UserEntity>;

  /**
   * @returns {Promise<UserEntity[]>}
   * @param input {Paginate}
   */
  getAll(input: Paginate): Promise<UserEntity[]>;

  /**
   * @returns {Promise<ProjectEntity>}
   * @param userEntity
   */
  store(userEntity: UserEntity): Promise<UserEntity>;

}
