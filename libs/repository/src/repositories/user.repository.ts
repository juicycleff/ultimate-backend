import { BaseRepository, EntityRepository } from '@juicycleff/nest-multi-tenant';
import { Injectable } from '@nestjs/common';
import {UserEntity} from '../entities';

@Injectable()
@EntityRepository({
  name: 'user',
  capped: true,
  size: 10000,
})
export class UserRepository extends BaseRepository<UserEntity> {}
