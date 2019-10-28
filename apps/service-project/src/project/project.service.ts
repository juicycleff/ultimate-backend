import { Injectable } from '@nestjs/common';
import { AuthRepository } from '@graphqlcqrs/repository';

@Injectable()
export class ProjectService {
  constructor(private readonly authRepository: AuthRepository) {}

  async test() {
    return await this.authRepository.findOne({ emailVerification: '786743' });
  }
}
