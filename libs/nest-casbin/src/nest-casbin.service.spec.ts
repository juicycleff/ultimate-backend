import { Test, TestingModule } from '@nestjs/testing';
import { NestCasbinService } from './nest-casbin.service';

describe('NestCasbinService', () => {
  let service: NestCasbinService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NestCasbinService],
    }).compile();

    service = module.get<NestCasbinService>(NestCasbinService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
