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
 * File name:         package-manager.ts
 * Last modified:     25/03/2021, 22:37
 ******************************************************************************/

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

/*
 * Because we don't want to depend on @nrwl/workspace (to speed up the workspace creation)
 * we duplicate the helper functions from @nrwl/workspace in this file.
 */

export function detectPackageManager(dir = '') {
  return existsSync(join(dir, 'yarn.lock'))
    ? 'yarn'
    : existsSync(join(dir, 'pnpm-lock.yaml'))
    ? 'pnpm'
    : 'npm';
}

/**
 * Returns commands for the package manager used in the workspace.
 * By default, the package manager is derived based on the lock file,
 * but it can also be passed in explicitly.
 *
 * Example:
 *
 * ```javascript
 * execSync(`${getPackageManagerCommand().addDev} my-dev-package`);
 * ```
 *
 */
export function getPackageManagerCommand(
  packageManager = detectPackageManager()
): {
  install: string;
  add: string;
  addDev: string;
  rm: string;
  exec: string;
  link: string;
  list: string;
  run: (script: string, args: string) => string;
} {
  switch (packageManager) {
    case 'yarn':
      return {
        install: 'yarn',
        add: 'yarn add',
        addDev: 'yarn add -D',
        rm: 'yarn remove',
        link: 'yarn link',
        exec: 'yarn',
        run: (script: string, args: string) => `yarn ${script} ${args}`,
        list: 'yarn list',
      };

    case 'pnpm':
      return {
        install: 'pnpm install --no-frozen-lockfile', // explicitly disable in case of CI
        add: 'pnpm add',
        addDev: 'pnpm add -D',
        rm: 'pnpm rm',
        link: 'pnpm link',
        exec: 'pnpx',
        run: (script: string, args: string) => `pnpm run ${script} -- ${args}`,
        list: 'pnpm ls --depth 100',
      };

    case 'npm':
      return {
        install: 'npm install --legacy-peer-deps',
        add: 'npm install --legacy-peer-deps',
        addDev: 'npm install --legacy-peer-deps -D',
        rm: 'npm rm',
        link: 'npm link',
        exec: 'npx',
        run: (script: string, args: string) => `npm run ${script} -- ${args}`,
        list: 'npm ls',
      };
  }
}

export function getPackageManagerVersion(
  packageManager: 'npm' | 'yarn' | 'pnpm'
): string {
  return execSync(`${packageManager} --version`).toString('utf-8').trim();
}
