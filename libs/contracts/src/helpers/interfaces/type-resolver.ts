import { GraphQLTypeResolver } from 'graphql';

import { ClassType } from './class-type';
import { MaybePromise, Maybe } from './maybe';

export type TypeResolver<TSource, TContext> = (
  ...args: Parameters<GraphQLTypeResolver<TSource, TContext>>
) => MaybePromise<Maybe<string | ClassType>>;
