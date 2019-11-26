import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { CacheModule } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        CqrsModule,
        CacheModule.register(),
      ],
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
