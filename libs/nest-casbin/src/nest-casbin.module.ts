import { DynamicModule, Module, Provider } from '@nestjs/common';
import { Adapter, Enforcer } from 'casbin';
import { ConnectionOptions } from 'typeorm';
import TypeORMAdapter from 'typeorm-adapter';
import { NestCasbinService } from './nest-casbin.service';
import { CASBIN_ENFORCER } from './nest-casbin.constants';

@Module({
  providers: [NestCasbinService],
  exports: [NestCasbinService],
})
export class NestCasbinModule {
  public static forRootAsync(
    dbConnectionOptions: ConnectionOptions,
    casbinModelPath: string,
  ): DynamicModule {
    const casbinEnforcerProvider: Provider = {
      provide: CASBIN_ENFORCER,
      useFactory: async () => {
        const adapter = await TypeORMAdapter.newAdapter(dbConnectionOptions);
        const enforcer = await new Enforcer();
        await enforcer.initWithAdapter(casbinModelPath, (adapter as any) as Adapter);
        await enforcer.loadPolicy();
        return enforcer;
      },
    };
    return {
      exports: [casbinEnforcerProvider, NestCasbinService],
      module: NestCasbinModule,
      providers: [casbinEnforcerProvider, NestCasbinService],
    };
  }
}
