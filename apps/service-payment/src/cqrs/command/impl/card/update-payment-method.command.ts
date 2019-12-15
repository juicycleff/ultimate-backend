import { ICommand } from '@nestjs/cqrs';
import { UpdateCardInput } from '../../../../types';
import { UserEntity } from '@graphqlcqrs/repository';

export class UpdatePaymentMethodCommand implements ICommand {
  constructor(
    public readonly input: UpdateCardInput,
    public readonly user: UserEntity,
  ) {}
}
