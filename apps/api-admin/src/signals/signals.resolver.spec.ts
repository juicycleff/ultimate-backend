import { Test, TestingModule } from '@nestjs/testing';
import { SignalsResolver } from './signals.resolver';

describe('SignalsResolver', () => {
  let resolver: SignalsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SignalsResolver],
    }).compile();

    resolver = module.get<SignalsResolver>(SignalsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
