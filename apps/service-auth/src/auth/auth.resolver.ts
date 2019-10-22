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
    console.log('************************');
    console.log(context.req.session);
    let auth = new AuthEntity();
    // @ts-ignore
    auth = {
      local: {
        email: 'rex@gmail.com',
        hashedPassword: 'blaaaaab',
      },
    };
    const gt = await this.authService.create(auth);
    // console.log(gt);
    console.log('************************');
    const { user } = await context.authenticate('graphql-local', { email: identifier, password });
    context.login(user);
    return {
      token: 'fgggfg',
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
