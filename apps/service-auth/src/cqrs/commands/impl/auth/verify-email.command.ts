import { ICommand } from '@nestjs/cqrs';

export class VerifyEmailCommand implements ICommand {
  constructor(
    public readonly code: number,
    public readonly email: string,
  ) {}
}
