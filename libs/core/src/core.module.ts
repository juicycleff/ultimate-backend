import { Module } from '@nestjs/common';
import { CoreService } from './core.service';

@Module({
  providers: [CoreService],
  exports: [CoreService],
})
export class CoreModule {}
