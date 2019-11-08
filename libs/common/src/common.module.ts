import { CommonService } from './common.service';
import { Module, Global, HttpModule } from '@nestjs/common';

import { AwsS3Service } from './services/aws-s3.service';
import { ConfigService } from './services/config.service';
import { GeneratorService } from './services/generator.service';
import { ValidatorService } from './services/validator.service';
import { AppLogger } from './services/app-logger.service';
import { YamlService } from './services/yaml.service';
import { CookieSerializer } from './providers';

const providers = [ConfigService, ValidatorService, AwsS3Service, GeneratorService, AppLogger];

@Global()
@Module({
  imports: [
    HttpModule,
  ],
  providers: [...providers, CommonService, YamlService, CookieSerializer],
  exports: [...providers, HttpModule, CommonService, YamlService, CookieSerializer],
})
export class CommonModule {}
