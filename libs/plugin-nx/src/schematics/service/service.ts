import {
  apply,
  chain,
  externalSchematic,
  mergeWith,
  move,
  Rule,
  SchematicContext,
  SchematicsException,
  template,
  Tree,
  url,
} from '@angular-devkit/schematics';
import { join, normalize, Path, strings } from '@angular-devkit/core';
import { Schema } from './schema';
import { formatFiles, updateJsonInTree } from '@nrwl/workspace';
import init from '../init/init';
import { appsDir } from '@nrwl/workspace/src/utils/ast-utils';
import { names } from '@nrwl/devkit';
import { camelCase, upperFirst } from 'lodash';
import { wrapAngularDevkitSchematic } from '@nrwl/devkit/ngcli-adapter';
import { UBConfig } from '../../utils/ub-config';

interface NormalizedSchema extends Schema {
  appProjectRoot: Path;
}

function updateUBWorkspace(schema: NormalizedSchema): Rule {
  return (host: Tree) => {
    const configPath = 'ub.json';
    const ubConfigFile = host.read(configPath);

    if (!ubConfigFile) {
      throw new SchematicsException(
        'Unable to find ub workspace configuration'
      );
    }
    const ubConfig: UBConfig = JSON.parse(ubConfigFile.toString());

    if (!ubConfig.services) {
      ubConfig.services = {};
    }

    ubConfig.services[schema.name] = {
      type: schema.kind,
      docker: true,
      kubernetes: false,
      language: 'typescript',
      name: schema.name,
      port: schema.port,
    };

    host.overwrite(configPath, JSON.stringify(ubConfig, null, 2));
  };
}

function addProtoFile(options: NormalizedSchema): Rule {
  if (options.transport.findIndex((value) => value === 'grpc') === -1) {
    return null;
  }

  return (host: Tree) => {
    host.create(
      join(options.appProjectRoot, 'src/assets/service.proto'),
      `
syntax = "proto3";
package ultimate_backend.${options.name};

message Message {
  string body = 1;
}

service ${upperFirst(camelCase(options.name))}Service {
  rpc SayHello(Message) returns (Message) {}
}
    `
    );
  };
}

function addMainFile(options: NormalizedSchema): Rule {
  const isGrpc =
    options.transport.findIndex((value) => value === 'grpc') !== -1;
  const isRest =
    options.transport.findIndex((value) => value === 'rest') !== -1;
  const isMultiTenant =
    options.features.findIndex((value) => value === 'multi-tenancy') !== -1;

  return (host: Tree) => {
    host.overwrite(
      join(options.appProjectRoot, 'src/main.ts'),
      `
import { NestFactory } from '@nestjs/core';
import { UBServiceFactory } from '@ultimate-backend/core';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await UBServiceFactory.create(app)
    ${isRest ? '.withSwagger()' : ''}
    ${isGrpc ? '.withGrpc()' : ''}
    ${isMultiTenant ? '.withMultiTenancy()' : ''}
    .withPoweredBy()
    .withPrefix('api')
    .start();
}

(async () => await bootstrap())();
    `
    );
  };
}

function addAppFiles(options: NormalizedSchema): Rule {
  return mergeWith(
    apply(url('./files/project'), [
      template({
        tmpl: '',
        name: options.name,
        port: options.port,
        root: options.appProjectRoot,
        ...strings,
        camelCase,
      }),
      move(join(options.appProjectRoot, 'src')),
    ])
  );
}

export default function (schema: Schema): Rule {
  return (host: Tree, context: SchematicContext) => {
    const options = normalizeOptions(host, schema);
    return chain([
      init({
        ...options,
        skipFormat: true,
      }),
      externalSchematic('@nrwl/node', 'application', schema),
      addMainFile(options),
      addProtoFile(options),
      addAppFiles(options),
      updateUBWorkspace(options),
      updateJsonInTree(
        join(options.appProjectRoot, 'tsconfig.app.json'),
        (json) => {
          json.compilerOptions.emitDecoratorMetadata = true;
          json.compilerOptions.target = 'es2015';
          return json;
        }
      ),
      formatFiles(options),
    ])(host, context);
  };
}

function normalizeOptions(host: Tree, options: Schema): NormalizedSchema {
  const appDirectory = options.directory
    ? `${names(options.directory).fileName}/${names(options.name).fileName}`
    : names(options.name).fileName;
  const appProjectRoot = join(normalize(appsDir(host)), appDirectory);

  return {
    ...options,
    appProjectRoot,
  };
}

export const applicationGenerator = wrapAngularDevkitSchematic(
  '@ultimate-backend/plugin-nx',
  'service'
);
