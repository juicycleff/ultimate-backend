import { Test, TestingModule } from '@nestjs/testing';
import { CardsResolver } from './cards.resolver';

describe('CardsResolver', () => {
  let resolver: CardsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CardsResolver],
    }).compile();

    resolver = module.get<CardsResolver>(CardsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
