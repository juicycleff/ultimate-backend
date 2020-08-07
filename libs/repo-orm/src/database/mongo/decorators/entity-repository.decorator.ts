/* tslint:disable:ban-types */
import { MongoCollectionProps, MongoEntityProps } from '../interfaces';
import { COLLECTION_KEY, ENTITY_KEY } from '../../../interfaces';

/**
 * Indicate the class represents a collection
 *
 * @export
 * @param {CollectionProps} props
 * @returns
 */
export const MongoEntityRepository = (props: MongoCollectionProps) => (
  target: any,
) => {
  Reflect.defineMetadata(COLLECTION_KEY, props, target.prototype);
};

/**
 * Indicate the class represents a collection
 *
 * @export
 * @param {CollectionProps} props
 * @returns
 */
export const MongoEntity = (props?: MongoEntityProps) => (target: any) => {
  Reflect.defineMetadata(ENTITY_KEY, props, target.prototype);
};
