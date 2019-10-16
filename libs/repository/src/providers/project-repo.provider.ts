import {Connection} from 'typeorm';
import { DbConstants } from '@graphqlcqrs/repository/db.constants';
import { ProjectRepository } from '@graphqlcqrs/repository/repositories/project.repository';

export const projectRepoProvider = [
  {
    provide: DbConstants.project,
    useFactory: (connection: Connection) => connection.getCustomRepository(ProjectRepository),
    inject: [DbConstants.db],
  },
];
