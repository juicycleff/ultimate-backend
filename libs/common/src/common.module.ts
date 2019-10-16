import { CommonService } from './common.service';
import { Module, Global, HttpModule } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AwsS3Service } from './services/aws-s3.service';
import { ConfigService } from './services/config.service';
import { GeneratorService } from './services/generator.service';
import { ValidatorService } from './services/validator.service';

const providers = [ConfigService, ValidatorService, AwsS3Service, GeneratorService];

@Global()

@Module({
  imports: [
    HttpModule,
    JwtModule.registerAsync({
      imports: [
        CommonModule,
      ],
      useFactory: (configService: ConfigService) => {
        return {
          secretOrPrivateKey: configService.get('JWT_SECRET_KEY'),
        };
      },
      inject: [
        ConfigService,
      ],
    }),
  ],
  providers: [CommonService],
  exports: [...providers, HttpModule, CommonService],
})
export class CommonModule {}
