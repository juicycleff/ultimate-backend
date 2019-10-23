import { CommonService } from './common.service';
import { Module, Global, HttpModule } from '@nestjs/common';

import { AwsS3Service } from './services/aws-s3.service';
import { ConfigService } from './services/config.service';
import { GeneratorService } from './services/generator.service';
import { ValidatorService } from './services/validator.service';
import { AppLogger } from './services/app-logger.service';

const providers = [ConfigService, ValidatorService, AwsS3Service, GeneratorService, AppLogger];

@Global()
@Module({
  imports: [
    HttpModule,
  ],
  providers: [...providers, CommonService],
  exports: [...providers, HttpModule, CommonService],
})
export class CommonModule {}
