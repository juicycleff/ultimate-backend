import { Scalar, CustomScalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';
import * as moment from 'moment';

@Scalar('Timestamp', (type) => Date)
export class TimestampScalar
  implements CustomScalar<number | string | Date, Date> {
  description = 'Date custom scalar type';

  parseValue(value: number | string | Date): Date {
    if (typeof value === 'number') {
      return new Date(value);
    } else if (typeof value === 'string') {
      return new Date(value);
    } else {
      return value;
    }
  }

  serialize(value: Date | number | string): any {
    if (typeof value === 'number') {
      return moment(value).format('YYYY-MM-DDTHH:mm:ss.SSSSSSSSSZZ');
    } else if (typeof value === 'string') {
      return moment(value).format('YYYY-MM-DDTHH:mm:ss.SSSSSSSSSZZ');
    } else {
      return moment(value).format('YYYY-MM-DDTHH:mm:ss.SSSSSSSSSZZ');
    }
  }

  parseLiteral(ast: ValueNode): Date {
    if (ast.kind === Kind.INT) {
      return new Date(ast.value);
    }
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    return null;
  }
}
