import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "You just reached rainsack. Keep looking at the screen, and you will see a green dot"', () => {
      expect(appController.getHello()).toBe(
        'You just reached rainsack. Keep looking at the screen, and you will see a green dot',
      );
    });
  });
});
