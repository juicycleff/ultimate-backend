import { Test, TestingModule } from '@nestjs/testing';
import { CardResolver } from './card.resolver';
import { CqrsModule } from '@nestjs/cqrs';

describe('CardResolver', () => {
  let resolver: CardResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [CardResolver],
    }).compile();

    resolver = module.get<CardResolver>(CardResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
