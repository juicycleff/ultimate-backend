/* tslint:disable:max-classes-per-file */
// import {IsLowercase} from 'class-validator';

export class FacebookAuth {

  userid: string;

  accessToken: string;

  name: string;

  email: string;
}

export class GoogleAuth {

  userid: string;

  accessToken: string;

  name: string;

  email: string;
}

export class LocalAuth {
  // @IsLowercase()
  email: string;

  hashedPassword: string;
}
