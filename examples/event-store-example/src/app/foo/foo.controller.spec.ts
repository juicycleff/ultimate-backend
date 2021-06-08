import { Test, TestingModule } from '@nestjs/testing';
import { FooController } from './foo.controller';

describe('FooController', () => {
  let controller: FooController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FooController],
    }).compile();

    controller = module.get<FooController>(FooController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
