import { names, offsetFromRoot } from '@nrwl/devkit';
import * as path from 'path';
import {
  addDepsToPackageJson,
  formatFiles,
  getProjectConfig,
} from '@nrwl/workspace';
import {
  apply,
  chain,
  MergeStrategy,
  mergeWith,
  Rule,
  SchematicContext,
  template,
  Tree,
  url,
  forEach,
} from '@angular-devkit/schematics';
import { join, normalize, strings } from '@angular-devkit/core';
import { appsDir } from '@nrwl/workspace/src/utils/ast-utils';
import { UBCQRSSchema } from './schema';

interface NormalizedSchema extends UBCQRSSchema {
  name: string;
  sourceRoot: string;
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
}

function normalizeOptions(host: Tree, options: UBCQRSSchema): NormalizedSchema {
  if (options.directory && !options.path) {
    options.path = options.directory;
  }

  const { sourceRoot } = getProjectConfig(host, options.project);
  const name = names(options.name).fileName;
  const projectDirectory = options.directory
    ? `${names(options.directory).fileName}/${name}`
    : name;
  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
  const projectRoot = join(normalize(appsDir(host)), projectDirectory);

  return {
    ...options,
    name,
    path: options.path,
    sourceRoot,
    spec: options.spec ?? options.unitTestRunner === 'jest',
    projectName,
    projectRoot,
    projectDirectory,
  };
}

function generateCQRSHandler(tree: Tree, options: NormalizedSchema): Rule {
  const templateOptions = {
    ...options,
    ...names(options.name),
    offsetFromRoot: offsetFromRoot(options.project),
    template: '',
    tmpl: '',
    ...strings,
  };

  let sourcePath = 'files/cqrs/commands';
  const dirPath = options.directory ? options.directory
    : `${options.sourceRoot}/app${
        options.group ? `/${options.group}/` : '/'
      }common/`;
  let targetPath = `${dirPath}commands`;

  if (options.type == 'event') {
    sourcePath = 'files/cqrs/events';
    targetPath = `${dirPath}events`;
  } else if (options.type == 'query') {
    sourcePath = 'files/cqrs/query';
    targetPath = `${dirPath}query`;
  }

  const templateSrc = apply(url(sourcePath), [
    template(templateOptions),
    forEach((fileEntry) => {
      const destPath = path.join(targetPath, fileEntry.path);
      if (tree.exists(destPath)) {
        let currentContent = tree.read(destPath).toString();
        const oldLines = currentContent.split('\n');
        const lines = fileEntry.content.toString().split('\n');

        const newLines = new Map();
        for (const line of oldLines) {
          if (line !== '') {
            newLines.set(line, line);
          }
        }

        for (const line of lines) {
          if (line !== '') {
            newLines.set(line, line);
          }
        }

        currentContent = Array.from(newLines.values()).join('\n');
        tree.overwrite(destPath, Buffer.from(currentContent));
      } else {
        tree.create(destPath, fileEntry.content);
      }
      return null;
    }),
  ]);

  return mergeWith(templateSrc, MergeStrategy.AllowOverwriteConflict);
}

export default function (schema: NormalizedSchema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const normalizedOptions = normalizeOptions(tree, schema);

    return chain([
      generateCQRSHandler(tree, normalizedOptions),
      addDepsToPackageJson(
        { '@nestjs/cqrs': '*', '@ultimate-backend/event-store': '*' },
        {}
      ),
      formatFiles(),
    ]);
  };
}
