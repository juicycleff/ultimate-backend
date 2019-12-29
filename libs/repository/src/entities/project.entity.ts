import {ProjectResponseDto} from '../dtos/response';
import {MongoBaseEntity} from './base-entity';
import { UserEntity } from './user.entity';
import { Entity } from '@juicycleff/nest-multi-tenant';

@Entity({ name: 'project' })
export class ProjectEntity extends MongoBaseEntity<ProjectResponseDto> {

  name: string;

  description?: string;

  owner: UserEntity;

  toDtoClass?: new(entity: MongoBaseEntity, options?: any) => ProjectResponseDto;
}
