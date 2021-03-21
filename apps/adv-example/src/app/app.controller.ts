import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';
import { HttpClient, HttpServiceClient } from '@ultimate-backend/client';

@Controller()
export class AppController {
  @HttpServiceClient('example')
  serviceInstance: HttpClient;

  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @Get('/example')
  async getExampleData() {
    const lot = await this.serviceInstance.get('api/');
    return lot.body;
  }
}
