import { Paginate } from '../../dtos/paginate.dto';
import {ProjectEntity} from '../../entities';

export interface ITenantRepo {
  /**
   * @returns {Promise<ProjectEntity[]>}
   * @param input {Paginate}
   */
  getAll(input: Paginate): Promise<ProjectEntity[]>;

  /**
   * @returns {Promise<ProjectEntity[]>}
   * @param id {string}
   */
  getById(id: string): Promise<ProjectEntity>;

  /**
   * @returns {Promise<ProjectEntity[]>}
   * @param path {string}
   */
  getByPath(path: string): Promise<ProjectEntity>;

  /**
   * @returns {Promise<ProjectEntity>}
   * @param tenant {ProjectEntity}
   */
  store(tenant: ProjectEntity): Promise<ProjectEntity>;

}
