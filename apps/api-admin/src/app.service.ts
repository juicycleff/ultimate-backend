import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'You just reached rainsack. Keep looking at the screen, and you will see a green dot';
  }
}
