import { Test, TestingModule } from '@nestjs/testing';
import { AuthPayloadResolver } from './auth-payload.resolver';

describe('AuthPayloadResolver', () => {
  let resolver: AuthPayloadResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthPayloadResolver],
    }).compile();

    resolver = module.get<AuthPayloadResolver>(AuthPayloadResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
