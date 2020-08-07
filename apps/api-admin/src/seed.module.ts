import { Injectable, Logger, Module } from '@nestjs/common';
import { InjectConfig } from '@nestcloud/config';
import * as fs from 'fs';
import { ConsulConfig } from '@nestcloud/config/consul-config';
import { Boot, InjectBoot } from '@nestcloud/boot';
import { join } from 'path';

@Injectable()
export class SeedService {
  logger = new Logger(this.constructor.name);

  constructor(
    @InjectConfig() private readonly config: ConsulConfig,
    @InjectBoot() private readonly boot: Boot,
  ) {
    this.seedConsulConfig();
  }

  public async seedConsulConfig() {
    try {
      if (process.env.NODE_ENV === 'production') {
        await this.consulConfigProd();
      } else {
        await this.consulConfigDev();
      }
    } catch (e) {
      this.logger.error(e);
    }
  }

  /**
   * WIP auto populate consul
   */
  private async consulConfigDev() {
    // Read consul key from bootstrap-<env>.yaml file
    const consulKey: string = this.boot.get('config.key');
    const hasConfig = await this.config.get();

    if (hasConfig === {}) {
      // Path to config example file
      const filePath = '/config.example';
      const value = await fs.readFileSync(join(__dirname, filePath), 'utf-8');
      await this.config.init();
      // await this.config.set(consulKey, value)
    }
    // console.log(hasConfig);
  }

  private consulConfigProd() {
    // TODO: finish up
  }
}

@Module({
  providers: [SeedService],
})
export class SeedModule {}
