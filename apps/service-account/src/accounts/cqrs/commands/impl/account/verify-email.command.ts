import { ICommand } from '@nestjs/cqrs';

export class VerifyEmailCommand implements ICommand {
  constructor(public readonly code: string, public readonly email: string) {}
}
