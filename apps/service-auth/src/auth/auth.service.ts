import { Injectable, Logger } from '@nestjs/common';
import { AuthRepository } from '@graphqlcqrs/repository/repositories/auth.repository';
import { AuthEntity } from '@graphqlcqrs/repository/entities';
import { AppLogger } from '@graphqlcqrs/common/services/app-logger.service';

@Injectable()
export class AuthService {
  constructor(
    private authRepository: AuthRepository,
    private logger: AppLogger,
  ) {}

  async create(auth: Partial<AuthEntity> | AuthEntity) {
    try {
      return await this.authRepository.create(auth);
    } catch (e) {
      this.logger.log(e);
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
