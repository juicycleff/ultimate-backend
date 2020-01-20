import {IQuery} from '@nestjs/cqrs';
import { UserFilterInput } from '../../../../types';

export class GetUserQuery implements IQuery {
  constructor(
    public readonly where: UserFilterInput,
  ) {}
}
