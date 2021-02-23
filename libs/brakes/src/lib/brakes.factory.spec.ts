import { Test } from '@nestjs/testing';
import { BrakesFactory } from './brakes.factory';
import { BrakesModuleOptions } from './brakes-module.options';
import { BRAKES_CONFIG_OPTIONS } from './brakes.constants';
import { BrakesResolver } from './brakes.resolver';

describe('BrakesFactory', () => {
  let service: BrakesFactory;

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
        BrakesFactory,
      ],
    }).compile();

    service = module.get(BrakesFactory);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });

  it('should be successfully create oppusum instance', async () => {
    const delay = (delay) =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, delay);
      });

    const ops = service.createBrake('delay', delay);
    expect(ops).toBeDefined();
  });

  it('should be successfully create oppusum instance', async () => {
    const delay = (delay) =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, delay);
      });

    const ops = service.createBrake('delay', delay);
    expect(ops).toBeDefined();
  });
});
