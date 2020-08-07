import * as _ from 'lodash';

export class DtoMapperUtils {
  /**
   * convert entity to dto class instance
   * @param {{new(entity: E, options: any): T}} model
   * @param {E[] | E} entity
   * @param options
   * @returns {T[] | T}
   */
  public static toDto<T, E>(
    model: new (entity: E, options?: any) => T,
    entity: E,
    options?: any,
  ): T;
  public static toDto<T, E>(
    model: new (entity: E, options?: any) => T,
    entity: E[],
    options?: any,
  ): T[];
  public static toDto<T, E>(
    model: new (entity: E, options?: any) => T,
    entity: E | E[],
    options?: any,
  ): T | T[] {
    if (_.isArray(entity)) {
      // @ts-ignore
      return entity.map((u) => new model(u, options));
    }

    // @ts-ignore
    return new model(entity, options);
  }

  /**
   * generate random string
   * @param length
   */
  static generateRandomString(length: number) {
    return Math.random()
      .toString(36)
      .replace(/[^a-zA-Z0-9]+/g, '')
      .substr(0, length);
  }

  static get<B, C = undefined>(
    func: () => B,
    defaultValue?: C,
  ): B | C | undefined {
    try {
      const value = func();

      if (_.isUndefined(value)) {
        return defaultValue;
      }
      return value;
    } catch {
      return defaultValue;
    }
  }
}
