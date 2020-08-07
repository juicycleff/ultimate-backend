import { Scalar, CustomScalar } from '@nestjs/graphql';
import { ApolloError } from 'apollo-server-express';
import { StringValueNode } from 'graphql/language/ast';

@Scalar('Mac')
export class MacScaler implements CustomScalar<string, string> {
  description = 'Mac properly validates numbers to be valid mac number or not';

  parseValue(value: string): string {
    if (!value.match('[0-9a-f]{2}([-:]?)[0-9a-f]{2}(\\1[0-9a-f]{2}){4}$')) {
      throw new ApolloError('invalid mac number');
    }
    return value;
  }

  serialize(value: string): string {
    if (!value.match('[0-9a-f]{2}([-:]?)[0-9a-f]{2}(\\1[0-9a-f]{2}){4}$')) {
      throw new ApolloError('invalid mac number');
    }
    return value;
  }

  parseLiteral(ast: StringValueNode): string {
    return ast.value;
  }
}
