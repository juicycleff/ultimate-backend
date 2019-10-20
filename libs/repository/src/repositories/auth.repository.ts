import { Injectable } from '@nestjs/common';
import {AuthEntity} from '../entities';
import { BaseRepository, EntityRepository } from '@juicycleff/nest-multi-tenant';

@Injectable()
@EntityRepository({
  name: 'authentication',
  capped: true,
  size: 10000,
})
export class AuthRepository extends BaseRepository<AuthEntity> {}
