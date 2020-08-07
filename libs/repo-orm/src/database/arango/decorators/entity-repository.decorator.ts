/* tslint:disable:ban-types */
import { ArangoCollectionProps, ArangoEntityProps } from '../interfaces';
import { COLLECTION_KEY, ENTITY_KEY } from '../../../interfaces';

/**
 * Indicate the class represents a collection
 *
 * @export
 * @param {CollectionProps} props
 * @returns
 */
export const ArangoEntityRepository = (props: ArangoCollectionProps) => (
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
export const ArangoEntity = (props?: ArangoEntityProps) => (target: any) => {
  Reflect.defineMetadata(ENTITY_KEY, props, target.prototype);
};
