import {Connection} from 'typeorm';
import { DbConstants } from '@graphqlcqrs/repository/db.constants';
import { AuthRepository } from '@graphqlcqrs/repository/repositories/auth.repository';

export const authRepoProvider = [
  {
    provide: DbConstants.auth,
    useFactory: (connection: Connection) => connection.getCustomRepository(AuthRepository),
    inject: [DbConstants.db],
  },
];
