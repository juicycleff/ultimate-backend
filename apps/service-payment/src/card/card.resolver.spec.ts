import { Test, TestingModule } from '@nestjs/testing';
import { CardResolver } from './card.resolver';
import { CoreModule } from '@graphqlcqrs/core';

describe('CardResolver', () => {
  let resolver: CardResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CoreModule],
      providers: [CardResolver],
    }).compile();

    resolver = module.get<CardResolver>(CardResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
