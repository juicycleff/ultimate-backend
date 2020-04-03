import { Scalar, CustomScalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';
import { fromCursor, toCursor } from '@ultimatebackend/common/utils';

@Scalar('Cursor')
export class CursorScaler implements CustomScalar<string, string> {
  description = 'Cursor scalar type';

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
