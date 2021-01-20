import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Oso } from 'oso';
import { PERMISSION_MODULE_OPTIONS } from './permissions.constants';
import { PermissionsModuleOptions } from './interfaces';
import { TypeMetadataStorage } from './storages';
import { Class } from 'oso/dist/src/types';
import { LoggerUtil } from '@ultimate-backend/common';

@Injectable()
export class OsoService extends Oso implements OnModuleInit {
  logger: LoggerUtil;

  constructor(
    @Inject(PERMISSION_MODULE_OPTIONS)
    private readonly options: PermissionsModuleOptions
  ) {
    super(options.oso);
    this.logger = new LoggerUtil('OsoService', options.debug);
  }

  private async setup() {
    try {
      this.initOso();
      await this.loadPolarFiles();
    } catch (e) {
      this.logger.error(e);
    }
  }

  private initOso() {
    this.logger.log('Initializing started... [Permission]');
    for (const os of TypeMetadataStorage.getOsoMetadata()) {
      this.logger.log(`register ${os.target.name}...`);
      this.registerClass(os.target as Class);
    }
  }

  private async loadPolarFiles() {
    if (!Array.isArray(this.options.polars)) {
      if (typeof this.options.polars === 'string') {
        await this.loadStr(this.options.polars);
      } else if (this.options.polars.file) {
        await this.loadFile(this.options.polars.polar);
      } else {
        await this.loadStr(this.options.polars.polar, this.options.polars.name);
      }
    } else {
      for (const po of this.options.polars) {
        if (typeof po === 'string') {
          await this.loadStr(po);
        } else {
          if (po.file) {
            await this.loadFile(po.name);
          } else {
            await this.loadStr(po.polar, po.name);
          }
        }
      }
    }
    this.logger.log('Initializing completed... [Permission]');
  }

  async onModuleInit(): Promise<void> {
    await this.setup();
  }
}
