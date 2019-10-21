import {UserResponseDto} from '../dtos/response';
import {AuthEntity} from './auth.entity';
import {BaseEntity} from './base-entity';
import { ProjectEntity } from './project.entity';
import { Entity } from '@juicycleff/nest-multi-tenant/database/mongo/decorators/entity.decorator';
import { Column } from 'typeorm';

@Entity({ name: 'user' })
export class UserEntity extends BaseEntity<UserResponseDto> {

  @Column({ unique: false, nullable: false })
  firstname: string;

  @Column({ unique: false, nullable: false  })
  lastname: string;

  @Column({ unique: true, nullable: false  })
  email: string;

  @Column(type => AuthEntity)
  auth?: AuthEntity;

  @Column(type => ProjectEntity)
  projects?: ProjectEntity[];

  toDtoClass?: new(entity: BaseEntity, options?: any) => UserResponseDto;
}
