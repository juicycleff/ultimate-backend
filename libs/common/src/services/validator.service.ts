import { Injectable } from '@nestjs/common';
import * as _ from 'lodash';

@Injectable()
export class ValidatorService {
  public isImage(mimeType: string): boolean {
    const imageMimeTypes = ['image/jpeg', 'image/png'];

    return _.includes(imageMimeTypes, mimeType);
  }
}
