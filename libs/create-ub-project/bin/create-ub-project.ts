#!/usr/bin/env node
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
 * File name:         create-ub-project.ts
 * Last modified:     25/03/2021, 22:35
 ******************************************************************************/
import { exec, execSync } from 'child_process';
import { writeFileSync } from 'fs';
import * as inquirer from 'inquirer';
import * as path from 'path';
import { dirSync } from 'tmp';
import * as yargsParser from 'yargs-parser';
import * as ora from 'ora';
import { showNxWarning, unparse } from './shared';
import { output } from '../src';

import {
  getPackageManagerCommand,
  getPackageManagerVersion,
} from './package-manager';
import { createUBConfig } from './bootstrap-ub';

export enum Preset {
  Empty = 'empty',
  Typescript = 'typescript',
  GoLang = 'go',
  RustLang = 'rust',
}

const presetOptions: { value: Preset; name: string }[] = [
  {
    value: Preset.Empty,
    name:
      'empty                [an empty project with a layout that works best for services]',
  },
  {
    value: Preset.Typescript,
    name:
      'typescript           [a project with a single Typescript/Node service]',
  },
  {
    value: Preset.GoLang,
    name: 'go                   [a project with a single Go service]',
  },
  {
    value: Preset.RustLang,
    name: 'rust                 [a project with a single Rust service]',
  },
];

const tsVersion = '~4.0.3';
const cliVersion = '^11.6.0-beta.4';
const nxVersion = '^11.6.0-beta.4';
const ubVersion = 'UB_VERSION';
const prettierVersion = '^2.2.1';
const angularVersion = '^11.2.7';

const parsedArgs: any = yargsParser(process.argv.slice(2), {
  string: [
    'cli',
    'preset',
    'appName',
    'linter',
    'defaultBase',
    'packageManager',
  ],
  alias: {
    packageManager: 'pm',
  },
  boolean: ['help', 'interactive', 'nxCloud'],
  default: {
    interactive: false,
  },
  configuration: {
    'strip-dashed': true,
    'strip-aliased': true,
  },
}) as any;
if (parsedArgs.help) {
  showHelp();
  process.exit(0);
}

const packageManager = parsedArgs.packageManager || 'npm';
determineProjectName(parsedArgs).then((name) => {
  determinePreset(parsedArgs).then((preset) => {
    return determineAppName(preset, parsedArgs).then((appName) => {
      return determineLinter(preset, parsedArgs).then((linter) => {
        return askAboutNxCloud(parsedArgs).then((nxCloud) => {
          const tmpDir = createSandbox(packageManager);
          return createApp(tmpDir, name, {
            ...parsedArgs,
            cli: 'nx',
            preset,
            appName,
            linter,
            nxCloud,
          }).then(() => {
            showNxWarning(name);
          });
        });
      });
    });
  });
});

function showHelp() {
  const options = Object.values(Preset)
    .map((preset) => `"${preset}"`)
    .join(', ');

  console.log(`
  Usage: create-ub-project <name> [options] [new project options]
  Create a new Nx workspace
  Options:
    name                      Project name (e.g., org name)
    preset                    What to language to create in a new project for (options: ${options})
    appName                   The name of the service app created by language presets

    linter                    Default linter. Options: "eslint", "tslint".
    interactive               Enable interactive mode when using presets (boolean)
    packageManager            Package manager to use (npm, yarn, pnpm)

    nx-cloud                  Use Nx Cloud (boolean)
    [new project options]   any 'new project' options
`);
}

function determineProjectName(parsedArgs: any): Promise<string> {
  const projectName: string = parsedArgs._[0];

  if (projectName) {
    return Promise.resolve(projectName);
  }

  return inquirer
    .prompt([
      {
        name: 'projectName',
        message: `project name (e.g., org name)    `,
        type: 'string',
      },
    ])
    .then((a) => {
      if (!a.projectName) {
        output.error({
          title: 'Invalid project name',
          bodyLines: [`Project name cannot be empty`],
        });
        process.exit(1);
      }
      return a.projectName;
    });
}

function determinePreset(parsedArgs: any): Promise<Preset> {
  if (parsedArgs.preset) {
    if (Object.values(Preset).indexOf(parsedArgs.preset) === -1) {
      output.error({
        title: 'Invalid preset',
        bodyLines: [
          `It must be one of the following:`,
          '',
          ...Object.values(Preset),
        ],
      });
      process.exit(1);
    } else {
      return Promise.resolve(parsedArgs.preset);
    }
  }

  return inquirer
    .prompt([
      {
        name: 'Preset',
        message: `What to language to use in the new project`,
        default: 'empty',
        type: 'list',
        choices: presetOptions,
      },
    ])
    .then((a: { Preset: Preset }) => a.Preset);
}

function determineAppName(preset: Preset, parsedArgs: any): Promise<string> {
  if (preset === Preset.Empty) {
    return Promise.resolve('');
  }

  if (parsedArgs.appName) {
    return Promise.resolve(parsedArgs.appName);
  }

  return inquirer
    .prompt([
      {
        name: 'AppName',
        message: `Service name                   `,
        type: 'string',
      },
    ])
    .then((a) => {
      if (!a.AppName) {
        output.error({
          title: 'Invalid name',
          bodyLines: [`Name cannot be empty`],
        });
        process.exit(1);
      }
      return a.AppName;
    });
}

function determineLinter(preset: Preset, parsedArgs: any) {
  if (!parsedArgs.linter) {
    return Promise.resolve('eslint');
  } else {
    if (parsedArgs.linter !== 'eslint' && parsedArgs.linter !== 'tslint') {
      output.error({
        title: 'Invalid linter',
        bodyLines: [`It must be one of the following:`, '', 'eslint', 'tslint'],
      });
      process.exit(1);
    } else {
      return Promise.resolve(parsedArgs.linter);
    }
  }
}

async function installUBPackages(name: string, cmd: string) {
  const fullCmd = `${cmd} @ultimate-backend/bootstrap @ultimate-backend/cloud @ultimate-backend/event-store @ultimate-backend/core`;
  console.log(name, cmd);
  console.log(fullCmd);
  await execAndWait(fullCmd, path.join(process.cwd(), name));
}

function createSandbox(packageManager: string) {
  output.log({
    title: 'UB is creating your project.',
    bodyLines: [
      'To make sure the command works reliably in all environments, and that the preset is applied correctly,',
      `UB will run "${packageManager} install" several times. Please wait.`,
    ],
  });
  const tmpDir = dirSync().name;
  writeFileSync(
    path.join(tmpDir, 'package.json'),
    JSON.stringify({
      dependencies: {
        '@nrwl/workspace': nxVersion,
        '@nrwl/tao': cliVersion,
        typescript: tsVersion,
        prettier: prettierVersion,
        '@angular-devkit/core': angularVersion,
      },
      license: 'MIT',
    })
  );

  execSync(`${packageManager} install --silent`, {
    cwd: tmpDir,
    stdio: [0, 1, 2],
  });

  return tmpDir;
}

async function createApp(tmpDir: string, name: string, parsedArgs: any) {
  const { _, cli, preset, ...restArgs } = parsedArgs;
  const args = unparse(restArgs).join(' ');

  const pmc = getPackageManagerCommand(packageManager);
  const command = `new ${name} ${args} --preset=empty --collection=@nrwl/workspace`;

  let nxWorkspaceRoot = `"${process.cwd().replace(/\\/g, '/')}"`;

  // If path contains spaces there is a problem in Windows for npm@6.
  // In this case we have to escape the wrapping quotes.
  if (
    process.platform === 'win32' &&
    /\s/.test(nxWorkspaceRoot) &&
    packageManager === 'npm'
  ) {
    const pmVersion = +getPackageManagerVersion(packageManager).split('.')[0];
    if (pmVersion < 7) {
      nxWorkspaceRoot = `\\"${nxWorkspaceRoot.slice(1, -1)}\\"`;
    }
  }
  const projectPath = path.join(process.cwd(), name);

  const fullCommand = `${pmc.exec} tao ${command}/collection.json --cli=${cli} --nxWorkspaceRoot=${nxWorkspaceRoot}`;
  const createServiceCommand = `npx nx g @ultimate-backend/plugin-nx:service ${restArgs.appName}`;
  const spinner = ora('Creating your Nx workspace').start();

  try {
    await execAndWait(fullCommand, tmpDir);
    await createUBConfig(name);

    spinner.text = 'Creating your default ultimate-backend service';

    await execAndWait(
      `${pmc.addDev} @angular-devkit/core @angular-devkit/schematics --silent`,
      projectPath
    );
    if (restArgs.preset !== 'empty') {
      await execAndWait(createServiceCommand, projectPath);
    }
  } catch (e) {
    output.error({
      title:
        'Something went wrong. Rerunning the command with verbose logging.',
    });
    execSync(fullCommand, {
      stdio: [0, 1, 2],
      cwd: tmpDir,
    });
  } finally {
    spinner.stop();
  }

  spinner.stop();
  output.success({
    title: 'ultimate-backend project was successfully created.',
  });

  if (parsedArgs.nxCloud) {
    output.addVerticalSeparator();
    execSync(`${pmc.exec} nx g @nrwl/nx-cloud:init --no-analytics`, {
      stdio: [0, 1, 2],
      cwd: path.join(process.cwd(), name),
    });
  }
}

function execAndWait(command: string, cwd: string) {
  return new Promise((res, rej) => {
    exec(command, { cwd }, (error, stdout, stderr) => {
      if (error) {
        rej();
      } else {
        res(null);
      }
    });
  });
}

async function askAboutNxCloud(parsedArgs: any) {
  if (parsedArgs.nxCloud === undefined) {
    return inquirer
      .prompt([
        {
          name: 'NxCloud',
          message: `Use Nx Cloud? (It's free and doesn't require registration.)`,
          type: 'list',
          choices: [
            {
              value: 'yes',
              name:
                'Yes [Faster builds, run details, Github integration. Learn more at https://nx.app]',
            },

            {
              value: 'no',
              name: 'No',
            },
          ],
          default: 'no',
        },
      ])
      .then((a: { NxCloud: 'yes' | 'no' }) => a.NxCloud === 'yes');
  } else {
    return parsedArgs.nxCloud;
  }
}
