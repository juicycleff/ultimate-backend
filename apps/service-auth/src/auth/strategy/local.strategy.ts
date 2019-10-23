import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { GraphQLLocalStrategy } from 'graphql-passport';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(GraphQLLocalStrategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(email: string, password: string): Promise<any> {
    if (email && password) {
      const user = await this.authService.validateUser(email, password);
      if (!user) {
        throw new UnauthorizedException();
      }
      return user;
    }
    throw new UnauthorizedException();
  }
}
