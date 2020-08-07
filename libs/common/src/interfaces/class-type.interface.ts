export interface ClassType<T = any> {
  new (...args: any[]): T;
}

export type NullableListOptions = 'items' | 'itemsAndList';

export interface DecoratorTypeOptions {
  nullable?: boolean | NullableListOptions;
  defaultValue?: any;
}
