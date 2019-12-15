import {IQuery} from '@nestjs/cqrs';
import { UserEntity } from '@graphqlcqrs/repository';

export class GetTenantQuery implements IQuery {
  constructor(
    public readonly where: any,
    public readonly user?: UserEntity,
  ) {}
}
