// import { IsNotEmpty } from 'class-validator';
import {ProjectResponseDto} from '../dtos/response';
import {BaseEntity} from './base-entity';
import { UserEntity } from './user.entity';
import { Entity } from '@juicycleff/nest-multi-tenant/database/mongo/decorators/entity.decorator';
import { Column } from 'typeorm';

@Entity({ name: 'project' })
export class ProjectEntity extends BaseEntity<ProjectResponseDto> {

  // @IsNotEmpty()
  @Column()
  name: string;

  @Column()
  description?: string;

  @Column(type => UserEntity)
  owner: UserEntity;

  toDtoClass?: new(entity: BaseEntity, options?: any) => ProjectResponseDto;
}
