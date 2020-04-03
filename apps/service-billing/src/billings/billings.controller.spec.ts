import { Test, TestingModule } from '@nestjs/testing';
import { BillingsController } from './billings.controller';

describe('Billings Controller', () => {
  let controller: BillingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BillingsController],
    }).compile();

    controller = module.get<BillingsController>(BillingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
