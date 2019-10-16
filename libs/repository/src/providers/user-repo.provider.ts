import {Connection} from 'typeorm';
import { DbConstants } from '@graphqlcqrs/repository/db.constants';
import { UserRepository } from '@graphqlcqrs/repository/repositories/user.repository';

export const userRepoProvider = [
  {
    provide: DbConstants.user,
    useFactory: (connection: Connection) => connection.getCustomRepository(UserRepository),
    inject: [DbConstants.db],
  },
];
