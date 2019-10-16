import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
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
