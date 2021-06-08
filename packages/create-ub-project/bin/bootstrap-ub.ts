import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';

const writeFileAsync = util.promisify(fs.writeFile);

interface UBConfigService {
  name: string;
  port: number;
  language?: string;
  type: string;
  docker?: boolean;
  kubernetes?: boolean;
}

interface UBConfig {
  name: string;
  services?: { [name: string]: UBConfigService };
}

export async function createUBConfig(project: string) {
  const ubConfig: UBConfig = {
    name: project,
    services: {},
  };

  const configPath = path.join(process.cwd(), `${project}/ub.json`);
  await writeFileAsync(configPath, JSON.stringify(ubConfig, null, 2));
}
