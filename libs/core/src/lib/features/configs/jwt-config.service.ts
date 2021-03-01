import { Injectable } from '@nestjs/common';
import { InjectConfig } from '@nestcloud/config';
import { KubernetesConfig } from '@nestcloud/config/config.kubernetes';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';

@Injectable()
export class JwtConfigService implements JwtOptionsFactory {
  constructor(@InjectConfig() private readonly config: KubernetesConfig) {}

  createJwtOptions(): Promise<JwtModuleOptions> | JwtModuleOptions {
    const jwtConstants = this.config.get<JwtModuleOptions>(
      'app.auth.jwtSettings'
    );
    return {
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '40000s' },
    };
  }
}
