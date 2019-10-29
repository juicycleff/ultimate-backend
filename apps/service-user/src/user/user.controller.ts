import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { plainToClass } from 'class-transformer';
import { User } from '../graphql';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @GrpcMethod('UserService', 'FindOne')
  async findOne(data: any, metadata: any): Promise<User> {
    console.log('Jumpp');
    return plainToClass(User, await this.userService.findOne(data));
  }
}
