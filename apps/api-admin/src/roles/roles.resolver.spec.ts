import { Test, TestingModule } from '@nestjs/testing';
import { RolesResolver } from './roles.resolver';

describe('RolesResolver', () => {
  let resolver: RolesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RolesResolver],
    }).compile();

    resolver = module.get<RolesResolver>(RolesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
