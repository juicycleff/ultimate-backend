import { COLLECTION_KEY, CollectionProps, ENTITY_KEY, EntityProps } from '../interfaces';

/**
 * Indicate the class represents a collection
 *
 * @export
 * @param {CollectionProps} props
 * @returns
 */
export const EntityRepository = (props: CollectionProps) =>  (target: any) => {
  Reflect.defineMetadata(COLLECTION_KEY, props, target.prototype);
};

/**
 * Indicate the class represents a collection
 *
 * @export
 * @param {CollectionProps} props
 * @returns
 */
export const Entity = (props?: EntityProps) =>  (target: any) => {
  Reflect.defineMetadata(ENTITY_KEY, props, target.prototype);
};
