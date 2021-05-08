import {
  chain,
  externalSchematic,
  Rule,
  Tree,
} from '@angular-devkit/schematics';
import { getProjectConfig } from '@nrwl/workspace';
import { NestSchematicsSchema } from './schema';
import { names } from '@nrwl/devkit';

interface NormalizedSchema extends NestSchematicsSchema {
  name: string;
  sourceRoot: string;
}

function normalizeOptions(
  host: Tree,
  options: NestSchematicsSchema
): NormalizedSchema {
  if (options.directory && !options.path) {
    options.path = options.directory;
  }

  const { sourceRoot } = getProjectConfig(host, options.project);
  const name = names(options.name).fileName;

  return {
    ...options,
    name,
    path: options.path,
    sourceRoot,
    spec: options.spec ?? options.unitTestRunner === 'jest',
  };
}

function run(options: NestSchematicsSchema): Rule {
  return (host: Tree) => {
    const normalizedOptions = normalizeOptions(host, options);
    return chain([
      externalSchematic(
        '@nestjs/schematics',
        (options.type as string).split('-')[1],
        normalizedOptions
      ),
    ]);
  };
}

export function module(options: NestSchematicsSchema) {
  return run({ ...options, type: 'nest-module' });
}

export function classSchematic(options: NestSchematicsSchema) {
  return run({ ...options, type: 'nest-class' });
}

export function controller(options: NestSchematicsSchema) {
  return run({ ...options, type: 'nest-controller' });
}

export function decorator(options: NestSchematicsSchema) {
  return run({ ...options, type: 'nest-decorator' });
}

export function filter(options: NestSchematicsSchema) {
  return run({ ...options, type: 'nest-filter' });
}

export function gateway(options: NestSchematicsSchema) {
  return run({ ...options, type: 'nest-gateway' });
}

export function guard(options: NestSchematicsSchema) {
  return run({ ...options, type: 'nest-guard' });
}

export function interceptor(options: NestSchematicsSchema) {
  return run({ ...options, type: 'nest-interceptor' });
}

export function interfaceSchematic(options: NestSchematicsSchema) {
  return run({ ...options, type: 'nest-interface' });
}

export function middleware(options: NestSchematicsSchema) {
  return run({ ...options, type: 'nest-middleware' });
}

export function pipe(options: NestSchematicsSchema) {
  return run({ ...options, type: 'nest-pipe' });
}

export function provider(options: NestSchematicsSchema) {
  return run({ ...options, type: 'nest-provider' });
}

export function resolver(options: NestSchematicsSchema) {
  return run({ ...options, type: 'nest-resolver' });
}

export function service(options: NestSchematicsSchema) {
  return run({ ...options, type: 'nest-service' });
}
