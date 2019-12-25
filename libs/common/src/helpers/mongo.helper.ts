
export type OptionalId<TSchema> = Omit<TSchema, '_id'> & { _id?: any };
