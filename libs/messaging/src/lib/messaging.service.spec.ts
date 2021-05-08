import { Test } from '@nestjs/testing';
import { MessagingService } from './messaging.service';

describe('MessagingService', () => {
  let service: MessagingService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [MessagingService],
    }).compile();

    service = module.get(MessagingService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
