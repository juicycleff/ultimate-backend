import { Test, TestingModule } from '@nestjs/testing';
import { NestCasbinService } from './nest-casbin.service';
import { Provider } from '@nestjs/common';
import { CASBIN_ENFORCER } from '@graphqlcqrs/nest-casbin/nest-casbin.constants';
import TypeORMAdapter from 'typeorm-adapter';
import { Adapter, Enforcer } from 'casbin';

describe('NestCasbinService', () => {
  let service: NestCasbinService;

  const casbinEnforcerProvider: Provider = {
    provide: CASBIN_ENFORCER,
    useFactory: async () => {
      // const adapter = await TypeORMAdapter.newAdapter(dbConnectionOptions);
      const enforcer = await new Enforcer();
      await enforcer.initWithAdapter('./test-file.conf', null);
      await enforcer.loadPolicy();
      return enforcer;
    },
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [casbinEnforcerProvider, NestCasbinService],
      exports: [NestCasbinService],
    }).compile();

    service = module.get<NestCasbinService>(NestCasbinService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
