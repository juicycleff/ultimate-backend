import { Global, HttpModule, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ValidatorService, AppLogger } from '../services';
import { CookieSerializer } from '@ultimatebackend/common';

const providers = [ValidatorService, AppLogger];

@Global()
@Module({
  imports: [HttpModule, CqrsModule],
  providers: [...providers, CookieSerializer],
  exports: [CqrsModule, ...providers, HttpModule, CookieSerializer],
})
export class CoreModule {}
