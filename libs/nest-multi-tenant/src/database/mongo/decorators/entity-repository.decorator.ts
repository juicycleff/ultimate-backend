import { COLLECTION_KEY, CollectionProps } from '../interfaces';

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
