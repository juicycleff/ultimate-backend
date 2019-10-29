import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { GraphQLLocalStrategy } from 'graphql-passport';
import { AuthService } from '../auth.service';
import { ServiceTypes } from '@graphqlcqrs/core/dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(GraphQLLocalStrategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(email: string, password: string): Promise<any> {
    if (email && password) {
      const user = await this.authService.validateUser({
        service: ServiceTypes.Password,
        params: {
          password,
          email,
        },
      });

      if (!user) {
        throw new UnauthorizedException();
      }
      return user;
    }
    throw new UnauthorizedException();
  }
}
