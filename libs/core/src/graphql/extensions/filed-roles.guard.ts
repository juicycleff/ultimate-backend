import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { GraphQLNonNull, GraphQLObjectType, GraphQLResolveInfo } from 'graphql';
import * as graphqlFields from 'graphql-fields';

@Injectable()
export class FieldRolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const info = GqlExecutionContext.create(context).getInfo<
      GraphQLResolveInfo
    >();
    const returnType = (info.returnType instanceof GraphQLNonNull
      ? info.returnType.ofType
      : info.returnType) as GraphQLObjectType;

    const fields = returnType.getFields();
    const requestedFields = graphqlFields(info);

    Object.entries(fields)
      .filter(([key]) => key in requestedFields)
      .map(([_, field]) => field)
      .filter((field) => field.extensions && field.extensions.role)
      .forEach((field) => {
        // match user and field roles here
        console.log(field.extensions.role);
      });

    return true;
  }
}
