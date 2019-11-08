import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { GraphQLLocalStrategy } from 'graphql-passport';

@Injectable()
export class BuilderUserStrategy extends PassportStrategy(GraphQLLocalStrategy) {

  async validate(email: string, password: string): Promise<any> {
    // console.log('*************************');
  }
}
