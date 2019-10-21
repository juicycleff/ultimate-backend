import {IQuery} from '@nestjs/cqrs';
import {FindConditions} from 'typeorm';
import { AuthEntity } from '@graphqlcqrs/repository';

export class GetAuthQuery implements IQuery {
  constructor(
    public readonly where: FindConditions<AuthEntity>,
  ) {}
}
