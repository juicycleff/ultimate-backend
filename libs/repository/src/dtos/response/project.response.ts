// import {IsNotEmpty} from 'class-validator';
import { BaseDto } from '../base.dto';

export class ProjectResponseDto extends BaseDto {
  // @IsNotEmpty()
  name: string;
}
