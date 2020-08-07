import { Address } from '@ultimatebackend/contracts';
import { AggregateRoot } from '@nestjs/cqrs';
import { Type } from 'class-transformer';

export class CardEntity extends AggregateRoot {
  id: string;

  name: string;

  number: string;

  brand?: string;

  lastFourDigit?: string;

  currency?: string;

  @Type(() => Address)
  address?: Address;

  expMonth: number;

  expYear: number;
}
