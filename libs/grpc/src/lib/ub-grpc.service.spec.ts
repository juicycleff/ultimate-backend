import { Test } from '@nestjs/testing';
import { UBGrpcService } from './ub-grpc.service';

describe('UBGrpcService', () => {
  let service: UBGrpcService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [UBGrpcService],
    }).compile();

    service = module.get(UBGrpcService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
