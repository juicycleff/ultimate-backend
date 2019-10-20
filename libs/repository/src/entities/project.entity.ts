import { IsNotEmpty } from 'class-validator';
import { Column } from 'typeorm';
import {ProjectResponseDto} from '../dtos/response';
import {BaseEntity} from './base-entity';
import { UserEntity } from './user.entity';
import { Entity } from '../decorators';

@Entity({ name: 'project' })
export class ProjectEntity extends BaseEntity<ProjectResponseDto> {

  @IsNotEmpty()
  @Column()
  name: string;

  @Column()
  description?: string;

  @Column(type => UserEntity)
  owner: UserEntity;

  toDtoClass?: new(entity: BaseEntity, options?: any) => ProjectResponseDto;
}
