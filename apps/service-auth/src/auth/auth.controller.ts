import { Controller, Get, Post, Req, Request, NotImplementedException } from '@nestjs/common';
import * as passport from 'passport';

@Controller('auth')
export class AuthController {

  @Get('/facebook')
  async facebookLogin(@Req() req: Request) {
    return passport.authenticate('facebook', {
      successRedirect: '/',
      failureRedirect: '/login',
    });
  }

  @Post('/facebook/callback')
  async facebookLoginCallback(@Req() req: Request) {
    // TODO: implement facebook login
    throw new NotImplementedException();
  }
}
