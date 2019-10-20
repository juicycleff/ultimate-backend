import {Entity, Column, OneToOne, JoinColumn, OneToMany} from 'typeorm';
import {UserResponseDto} from '../dtos/response';
import {AuthEntity} from './auth.entity';
import {BaseEntity} from './base-entity';
import { ProjectEntity } from './project.entity';

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
