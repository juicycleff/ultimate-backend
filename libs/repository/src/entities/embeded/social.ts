/* tslint:disable:max-classes-per-file */
// import {IsLowercase} from 'class-validator';

export class FacebookAuth {

  // @Column({ nullable: true })
  id: string;

  // @Column({ nullable: true })
  accessToken: string;

  // @Column({ nullable: true })
  name: string;

  // @Column({ nullable: true })
  email: string;
}

export class GoogleAuth {

  // @Column({ nullable: true })
  id: string;

  // @Column({ nullable: true })
  accessToken: string;

  // @Column({ nullable: true })
  name: string;

  // @Column({ nullable: true })
  email: string;
}

export class LocalAuth {
  // @IsLowercase()
  // @Column({ nullable: true, type: 'varchar' })
  email: string;

  // @Column({ nullable: true, type: 'varchar' })
  hashedPassword: string;
}
