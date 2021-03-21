import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {

  async getData(): Promise<{ message: string }> {
    return { message: 'Welcome to adv-example!' };
  }
}
