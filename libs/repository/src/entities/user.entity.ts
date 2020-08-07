import { Entity } from '@juicycleff/repo-orm';
import { IsArray, IsString, MinLength } from 'class-validator';
import { UserResponseDto } from '../dtos/response';
import { BaseEntity } from './base-entity';
import { SocialAuth, LocalAuth } from './embeded';

@Entity({ name: 'user' })
export class UserEntity extends BaseEntity<UserResponseDto> {
  @MinLength(2)
  @MinLength(20)
  @IsString()
  firstname: string;

  @MinLength(2)
  @MinLength(20)
  @IsString()
  lastname: string;

  @MinLength(2)
  @MinLength(20)
  @IsString()
  username?: string;

  deactivated?: boolean = false;

  @IsArray()
  emails?: [
    {
      address: string;
      verified: boolean;
      primary: boolean;
      verificationCode: string | number;
    },
  ];

  services!: AuthServicesTypes;

  settings!: SettingsEmbed;

  toDtoClass?: new (entity: BaseEntity, options?: any) => UserResponseDto;
}

export class AuthServicesTypes {
  password?: LocalAuth;

  facebook?: SocialAuth;

  github?: SocialAuth;

  google?: SocialAuth;
}

class SettingsEmbed {
  stripeId?: string = null;
}
