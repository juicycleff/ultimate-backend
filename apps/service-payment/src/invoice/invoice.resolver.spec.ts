import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceResolver } from './invoice.resolver';
import { CoreModule } from '@graphqlcqrs/core';

describe('InvoiceResolver', () => {
  let resolver: InvoiceResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CoreModule],
      providers: [InvoiceResolver],
    }).compile();

    resolver = module.get<InvoiceResolver>(InvoiceResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
