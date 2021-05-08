import { Body, Controller, Post } from '@nestjs/common';
import { KillDragonDto } from './types';
import { FooService } from './foo.service';

@Controller('foo')
export class FooController {
  constructor(private fooService: FooService) {}

  @Post('/')
  async index(@Body() cmd: KillDragonDto) {
    await this.fooService.killDragon('Yahsua', cmd);
  }
}
