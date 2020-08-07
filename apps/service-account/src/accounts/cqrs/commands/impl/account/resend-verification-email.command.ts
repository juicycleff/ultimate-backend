import { ICommand } from '@nestjs/cqrs';

export class ResendVerificationEmailCommand implements ICommand {
  constructor(public readonly email: string) {}
}
