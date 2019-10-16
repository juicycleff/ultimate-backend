import { Test, TestingModule } from '@nestjs/testing';
import { NestjsEventStoreService } from './nestjs-event-store.service';

describe('NestjsEventStoreService', () => {
  let service: NestjsEventStoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NestjsEventStoreService],
    }).compile();

    service = module.get<NestjsEventStoreService>(NestjsEventStoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
