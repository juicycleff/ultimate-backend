import { Injectable } from '@nestjs/common';
// import * as AWS from 'aws-sdk';
// import * as mime from 'mime-types';
// import { ConfigService } from '../configs/config.service';
// import { GeneratorService } from './generator.service';
// import { IFile } from '@ultimatebackend/common/interfaces';

@Injectable()
export class AwsS3Service {
  /* tslint:disable-next-line:variable-name
  private readonly _s3: AWS.S3;

  constructor(
    public configService: ConfigService,
    public generatorService: GeneratorService,
  ) {
    const options: AWS.S3.Types.ClientConfiguration = {
      apiVersion: '2010-12-01',
      region: 'eu-central-1',
    };

    const awsS3Config = configService.awsS3Config;
    if (awsS3Config.accessKeyId && awsS3Config.secretAccessKey) {
      options.credentials = awsS3Config;
    }

    this._s3 = new AWS.S3(options);
  }

  async uploadImage(file: IFile) {
    const fileName = this.generatorService.fileName(
      mime.extension(file.mimetype) as string,
    );
    const key = 'images/' + fileName;
    await this._s3
      .putObject({
        Bucket: this.configService.awsS3Config.bucketName,
        Body: file.buffer,
        ACL: 'public-read',
        Key: key,
      })
      .promise();

    return key;
  } */
}
