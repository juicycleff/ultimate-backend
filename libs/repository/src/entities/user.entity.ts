import { Entity } from '@juicycleff/nest-multi-tenant';
import {UserResponseDto} from '../dtos/response';
import {MongoBaseEntity} from './base-entity';
import { FacebookAuth, GoogleAuth } from '@graphqlcqrs/repository/entities/embeded';

@Entity({ name: 'user' })
export class UserEntity extends MongoBaseEntity<UserResponseDto> {

  firstname: string;

  lastname: string;

  username?: string;

  roles?: string[];

  deactivated!: boolean;

  emails?: [
    {
      address: string,
      verified: boolean,
      primary: boolean,
      verificationCode: string | number;
    }
  ];

  services!: AuthServices;

  payment!: PaymentEmbed;

  toDtoClass?: new(entity: MongoBaseEntity, options?: any) => UserResponseDto;
}

interface AuthServices {
  password?: {
    hashed: string,
  };

  facebook?: FacebookAuth;

  google?: GoogleAuth;
}

interface PaymentEmbed {
  stripeId?: string;
}
