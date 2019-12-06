import { Test, TestingModule } from '@nestjs/testing';
import { BootstrapServiceService } from './bootstrap-service.service';

describe('BootstrapServiceService', () => {
  let service: BootstrapServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BootstrapServiceService],
    }).compile();

    service = module.get<BootstrapServiceService>(BootstrapServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
