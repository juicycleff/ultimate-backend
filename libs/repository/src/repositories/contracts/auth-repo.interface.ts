import {AuthEntity, LocalAuth} from '../../entities';

export interface IAuthRepo {

  /**
   * @returns {Promise<AuthEntity>}
   * @param local
   */
  getByLocal(local: LocalAuth): Promise<AuthEntity>;

  /**
   * @returns {Promise<AuthEntity>}
   * @param authEntity
   */
  store(authEntity: AuthEntity): Promise<AuthEntity>;

}
