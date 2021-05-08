import { Controller, Get, Req } from '@nestjs/common';

import { AppService } from './app.service';
import { HttpClient, HttpServiceClient } from '@ultimate-backend/client';

@Controller()
export class AppController {
  @HttpServiceClient('example')
  serviceInstance: HttpClient;

  constructor(private readonly appService: AppService) {}

  @Get()
  getData(@Req() request: Request) {
    const username = request.headers['username'];
    const resId = parseInt(request.headers['res-id']);
    return this.appService.getData(username, 'GET', resId);
  }

  @Get('/example')
  async getExampleData() {
    const lot = await this.serviceInstance.get('api/');
    return lot.body;
  }
}
