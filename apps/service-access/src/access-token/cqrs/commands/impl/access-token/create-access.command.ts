import { ICommand } from '@nestjs/cqrs';
import { CreateAccessRequest } from '@ultimatebackend/proto-schema/access';
import { UserEntity } from '@ultimatebackend/repository';

export class CreateAccessCommand implements ICommand {
  constructor(
    public readonly cmd: CreateAccessRequest,
    public readonly user: UserEntity,
  ) {}
}
