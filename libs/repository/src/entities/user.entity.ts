import { Entity } from '@juicycleff/nest-multi-tenant/database/mongo/decorators/entity.decorator';
import {UserResponseDto} from '../dtos/response';
import {BaseEntity} from './base-entity';
import { FacebookAuth, GoogleAuth } from '@graphqlcqrs/repository/entities/embeded';

@Entity({ name: 'user' })
export class UserEntity extends BaseEntity<UserResponseDto> {

  firstname: string;

  lastname: string;

  username?: string;

  emails?: [
    {
      address: string,
      verified: boolean,
      primary: boolean,
      verificationCode: string | number;
    }
  ];

  services: {
    password?: {
      hashed: string;
    };

    facebook?: FacebookAuth;

    google?: GoogleAuth,
  };

  toDtoClass?: new(entity: BaseEntity, options?: any) => UserResponseDto;
}
