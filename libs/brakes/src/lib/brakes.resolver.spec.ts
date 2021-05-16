import { Test } from '@nestjs/testing';
import { BrakesModuleOptions } from './brakes-module.options';
import { BRAKES_CONFIG_OPTIONS } from './brakes.constants';
import { BrakesResolver } from './brakes.resolver';
import * as Opossum from 'opossum';

describe('BrakesResolver', () => {
  let service: BrakesResolver;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: BRAKES_CONFIG_OPTIONS,
          useValue: {
            allowWarmUp: true,
          } as BrakesModuleOptions,
        },
        BrakesResolver,
      ],
    }).compile();

    service = module.get(BrakesResolver);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });

  it('should be successfully add brakes and get brakes', async () => {
    const ops = new Opossum(async () => 'come-text', { resetTimeout: 300 });

    service.addBrakes('test', ops);
    expect(service.getBrakes('test')).toBeDefined();
    expect(service.getBrakes('test')).toBeInstanceOf(Opossum);
  });
});
