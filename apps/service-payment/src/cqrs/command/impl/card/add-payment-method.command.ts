import { ICommand } from '@nestjs/cqrs';
import { UserEntity } from '@graphqlcqrs/repository';
import { CardInput } from '@ultimatebackend/contracts';

export class AddPaymentMethodCommand implements ICommand {
  constructor(
    public readonly input: CardInput,
    public readonly user: UserEntity,
  ) {}
}
