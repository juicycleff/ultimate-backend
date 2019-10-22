import { Injectable } from '@nestjs/common';
import { AuthRepository } from '@graphqlcqrs/repository/repositories/auth.repository';
import { AuthEntity } from '@graphqlcqrs/repository/entities';

@Injectable()
export class AuthService {
  constructor(private authRepository: AuthRepository) {}

  async create(auth: Partial<AuthEntity> | AuthEntity) {
    try {
      return await this.authRepository.create(auth);
    } catch (e) {
      console.log(e);
    }
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = {
      password: 'pass',
      email: 'ghghg@gghh.com',
    };
    if (user && user.password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
