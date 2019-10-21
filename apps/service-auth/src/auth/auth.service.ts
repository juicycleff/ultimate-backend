import { Injectable } from '@nestjs/common';
import { AuthRepository } from '@graphqlcqrs/repository/repositories/auth.repository';

@Injectable()
export class AuthService {
  constructor(private authRepository: AuthRepository) {}

  async create(cat: any) {
    // @ts-ignore
    return await this.authRepository.create({
      local: {
        email: 'juicycleff@gmail.com',
        hashedPassword: 'green',
      },
    }); // save(cat);
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
