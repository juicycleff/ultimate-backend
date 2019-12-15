import { Test, TestingModule } from '@nestjs/testing';
import { PlanController } from './plan.controller';
import { CqrsModule } from '@nestjs/cqrs';

describe('Plan Controller', () => {
  let controller: PlanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
      controllers: [PlanController],
    }).compile();

    controller = module.get<PlanController>(PlanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
