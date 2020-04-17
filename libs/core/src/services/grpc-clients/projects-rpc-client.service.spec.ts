import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsRpcClientService } from './projects-rpc-client.service';

describe('ProjectsRpcClientService', () => {
  let service: ProjectsRpcClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectsRpcClientService],
    }).compile();

    service = module.get<ProjectsRpcClientService>(ProjectsRpcClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
