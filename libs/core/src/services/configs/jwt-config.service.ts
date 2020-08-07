import { Injectable } from '@nestjs/common';
import { ConsulConfig, InjectConfig } from '@nestcloud/config';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';

@Injectable()
export class JwtConfigService implements JwtOptionsFactory {
  constructor(@InjectConfig() private readonly config: ConsulConfig) {}

  createJwtOptions(): Promise<JwtModuleOptions> | JwtModuleOptions {
    const jwtConstants = this.config.get<JwtModuleOptions>(
      'app.auth.jwtSettings',
    );
    console.log(jwtConstants);
    return {
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '40000s' },
    };
  }
}
