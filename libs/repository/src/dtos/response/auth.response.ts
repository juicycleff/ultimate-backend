// import {IsNotEmpty} from 'class-validator';
import { BaseDto } from '../base.dto';

export class AuthResponseDto extends BaseDto {
  // @IsNotEmpty()
  name: string;
}
