import { ICommand } from '@nestjs/cqrs';
import { DeleteCardInput } from '../../../../types';
import { UserEntity } from '@graphqlcqrs/repository';

export class RemovePaymentMethodCommand implements ICommand {
  constructor(
    public readonly input: DeleteCardInput,
    public readonly user: UserEntity,
  ) {}
}
