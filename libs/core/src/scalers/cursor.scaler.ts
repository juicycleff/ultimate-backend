import { Scalar, CustomScalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';
import { fromCursor, toCursor } from '@ultimatebackend/common/utils';

export type GqlCursor = string;

@Scalar('Cursor')
export class CursorScaler implements CustomScalar<string, GqlCursor> {
  description = 'Cursor scalar type that serializes string to and from base64';

  parseValue(value: string): string {
    return fromCursor(value);
  }

  serialize(value: string): string {
    if (value) {
      return toCursor({ value });
    } else {
      return null;
    }
  }

  parseLiteral(ast: ValueNode): string {
    if (ast.kind === Kind.STRING) {
      return fromCursor(ast.value);
    }
    return null;
  }
}
