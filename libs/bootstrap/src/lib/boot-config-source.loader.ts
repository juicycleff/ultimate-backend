/*******************************************************************************
 * Copyright (c) 2021. Rex Isaac Raphael
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files
 * (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge,
 * publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
 * THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
 * CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 *
 * File name:         boot-config-source.loader.ts
 * Last modified:     26/03/2021, 14:14
 ******************************************************************************/
import { Injectable } from '@nestjs/common';
import { BootstrapModuleOptions } from './boostrap-module.options';
import * as path from 'path';
import { defaultsDeep } from 'lodash';
import * as fs from 'fs';
import { stringToObjectType } from '@ultimate-backend/common';
import { InjectConfigOptions } from './decorators/inject-config.decorator';

@Injectable()
export class BootConfigSourceLoader {
  private readonly files: string[];

  constructor(
    @InjectConfigOptions() private readonly options: BootstrapModuleOptions
  ) {
    this.files = this.getFilesPath();
  }

  public load(): any {
    const configs = [];
    this.checkFileExists();
    this.files.forEach((file, index) => {
      configs.push(this.loadFile(file));
    });
    return defaultsDeep({}, ...configs);
  }

  private checkFileExists() {
    if (this.files.length === 0) {
      throw new Error(`file bootstrap ${path} was not found`);
    }

    for (const f of this.files) {
      if (!fs.existsSync(f)) {
        throw new Error(`file ${f} was not found`);
      }
    }
  }

  public loadFile(path: string): any {
    let config = {};
    if (!fs.existsSync(path)) {
      return config;
    }
    const configStr = fs.readFileSync(path).toString();
    config = stringToObjectType(configStr);
    return config;
  }

  private getFilesPath(): string[] {
    const filenames: string[] = [];
    const env = process.env.NODE_ENV || 'development';
    const dirname = path.dirname(this.options.filePath);
    const filename = path.basename(this.options.filePath);
    const tokens = /(.+)\.(.+)/.exec(filename);
    if (tokens) {
      tokens.reverse().pop();
      filenames.push(path.resolve(dirname, `${tokens[1]}.${tokens[0]}`));
      if (!this.options.disableEnv) {
        filenames.push(
          path.resolve(dirname, `${tokens[1]}.${env}.${tokens[0]}`)
        );
      }
    } else {
      filenames.push(path.resolve(dirname, filename));
      if (!this.options.disableEnv) {
        filenames.push(path.resolve(dirname, `${filename}.${env}`));
      }
    }

    return filenames;
  }
}
