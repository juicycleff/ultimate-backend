// import {IsNotEmpty} from 'class-validator';
import { BaseDto } from '../base.dto';

export class UserResponseDto extends BaseDto {
  // @IsNotEmpty()
  firstname: string;

  // @IsNotEmpty()
  lastname: string;

  // @IsNotEmpty()
  email: string;
}
