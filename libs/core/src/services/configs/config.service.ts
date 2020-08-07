import * as dotenv from 'dotenv';
import { IAwsConfigInterface } from '@ultimatebackend/common/interfaces';

export class ConfigService {
  constructor() {
    const nodeEnv = this.nodeEnv;
    dotenv.config({
      path: `${nodeEnv}.env`,
    });

    // Replace \\n with \n to support multiline strings in AWS
    for (const envName of Object.keys(process.env)) {
      process.env[envName] = process.env[envName].replace(/\\n/g, '\n');
    }
  }

  public get(key: string): string {
    return process.env[key];
  }

  public getNumber(key: string): number {
    return Number(this.get(key));
  }

  get nodeEnv(): string {
    return this.get('NODE_ENV') || 'development';
  }

  isEnv(env: string) {
    return this.get('NODE_ENV') === env;
  }

  get awsS3Config(): IAwsConfigInterface {
    return {
      accessKeyId: this.get('AWS_S3_ACCESS_KEY_ID'),
      secretAccessKey: this.get('AWS_S3_SECRET_ACCESS_KEY'),
      bucketName: this.get('S3_BUCKET_NAME'),
    };
  }
}
