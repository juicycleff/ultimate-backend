import { Controller, Get, UseGuards } from '@nestjs/common';
import * as passport from 'passport';
import { AuthGuard } from '@nestjs/passport';
import { ApiOkResponse } from '@nestjs/swagger';

@Controller('account')
export class AccountsController {
  @ApiOkResponse()
  @UseGuards(AuthGuard('facebook'))
  @Get('/facebook')
  facebookAuth() {
    passport.authenticate('facebook');
  }

  @ApiOkResponse()
  @UseGuards(AuthGuard('google'))
  @Get('/google')
  googleAuth() {
    passport.authenticate('google');
  }

  @ApiOkResponse()
  @UseGuards(AuthGuard('github'))
  @Get('/github')
  githubAuth() {
    passport.authenticate('github');
  }
}
