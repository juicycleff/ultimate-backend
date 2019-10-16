import { IsNotEmpty } from 'class-validator';
import { Entity, Column, ManyToOne } from 'typeorm';
import {ProjectResponseDto} from '../dtos/response';
import {BaseEntity} from './base-entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'project' })
export class ProjectEntity extends BaseEntity<ProjectResponseDto> {

  @IsNotEmpty()
  @Column()
  name: string;

  @Column()
  description?: string;

  @ManyToOne(type => UserEntity, user => user.projects)
  owner: UserEntity;

  toDtoClass?: new(entity: BaseEntity, options?: any) => ProjectResponseDto;
}
