// tslint:disable-next-line:no-var-requires
const ymlConfig = require('config-yml').load(process.env.NODE_ENV === undefined ? 'development' : process.env.NODE_ENV);

export const AppConfig = ymlConfig;

export class YamlService {
  config: any;

  constructor() {
    this.config = ymlConfig;
  }

  public get(key: string): string {
    return this.config;
  }

  get nodeEnv(): string {
    return this.config.envId;
  }

  isEnv(env: string) {
    return this.config.envId === env;
  }
}
