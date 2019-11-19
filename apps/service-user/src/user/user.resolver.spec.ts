import { Test, TestingModule } from '@nestjs/testing';
import { UserResolver } from './user.resolver';
import { CqrsModule } from '@nestjs/cqrs';
import { CacheModule } from '@nestjs/common';

describe('UserResolver', () => {
  let resolver: UserResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        CqrsModule,
        CacheModule.register(),
      ],
      providers: [UserResolver],
    }).compile();

    resolver = module.get<UserResolver>(UserResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
