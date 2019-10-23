import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '@graphqlcqrs/common/guards';
import { AuthService } from './auth.service';
import { AuthEntity } from '@graphqlcqrs/repository/entities';

@Resolver('AuthPayload')
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Mutation('login')
  async login(@Args('input') {identifier, password}: any, @Context() context: any) {
    // TODO: implement this

    // This is only for dev, it's not a functional piece yet
    const authPayload = {
      local: {
        email: 'rex@gmail.com',
        hashedPassword: 'blaaaaab',
      },
    } as AuthEntity;

    const auth = await this.authService.create(authPayload);

    const { user } = await context.authenticate('graphql-local', { email: identifier, password });
    context.login(user);
    return {
      token: auth.id,
      user,
    };
  }

  @UseGuards(GqlAuthGuard)
  @Mutation('logout')
  async logout(@Context() context: any) {
    try {
      // await context.logout();
      return {
        success: true,
      };
    } catch (e) {
      return {
        success: false,
      };
    }
  }
}
