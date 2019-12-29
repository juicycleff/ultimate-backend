// import { IsNotEmpty } from 'class-validator';
import {ProjectResponseDto} from '../dtos/response';
import {MongoBaseEntity} from './base-entity';
import { UserEntity } from './user.entity';
import { Entity } from '@juicycleff/nest-multi-tenant';
import { Column } from 'typeorm';

@Entity({ name: 'project' })
export class ProjectEntity extends MongoBaseEntity<ProjectResponseDto> {

  @Column()
  name: string;

  @Column()
  description?: string;

  @Column(type => UserEntity)
  owner: UserEntity;

  toDtoClass?: new(entity: MongoBaseEntity, options?: any) => ProjectResponseDto;
}
