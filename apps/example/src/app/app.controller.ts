import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';
import {
  ServiceClient,
  GraphQLServiceClient,
  GraphQLClient,
} from '@ultimate-backend/client';
import { gql } from 'graphql-request';

@Controller()
export class AppController {
  @GraphQLServiceClient('adv-example', { path: '/graphql' })
  serviceInstance: GraphQLClient;

  constructor(private readonly appService: AppService) {}

  @Get('test')
  async getTestData() {
    const query = gql`
      query {
        users(input: { sex: { _EQ: Male } }) {
          id
          lastName
          firstName
        }
      }
    `;

    const data = (await this.serviceInstance.request(query)) as {
      users: any[];
    };
    return data?.users || [];
  }

  @Get()
  getData() {
    return this.appService.getData();
  }
}
