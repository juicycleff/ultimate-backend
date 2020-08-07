import { Scalar, CustomScalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';

@Scalar('JSON', (type) => JSON)
export class JsonScaler implements CustomScalar<object, object> {
  description = 'JSON scalar type';

  parseValue(value): object {
    return value;
  }

  serialize(value): object {
    return value;
  }

  parseLiteral(ast: ValueNode): object {
    if (ast.kind !== Kind.OBJECT) {
      throw new Error(`JSONObject cannot represent non-object value: ${ast}`);
    }
    // @ts-ignore
    return ast.value;
  }
}
