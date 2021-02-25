import { Injectable } from '@nestjs/common';
import { KillDragonCommand, KillDragonDto } from './types';
import { CommandBus } from '@nestjs/cqrs';

@Injectable()
export class FooService {
  constructor(private commandBus: CommandBus) {}

  async killDragon(heroId: string, killDragonDto: KillDragonDto) {
    return this.commandBus.execute(
      new KillDragonCommand(heroId, killDragonDto.dragonId)
    );
  }
}
