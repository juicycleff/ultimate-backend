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
 * File name:         create-project.command.ts
 * Last modified:     24/03/2021, 19:42
 ******************************************************************************/
import * as ora from 'ora';
import * as shell from 'shelljs';
import * as util from 'util';
import { ArrayOption, ICommand } from '../../interfaces';
import { output } from '../../utils';

const exec = util.promisify(shell.exec);

export class CreateProjectCommand implements ICommand {
  command = 'create <project-name> [actions...]';

  option: ArrayOption = [];

  description = 'create a new ultimate-backend project/workspace';

  action(buildTarget): void {
    try {
      ora.promise(
        exec(
          `create-ub-project ${buildTarget} --preset=nest --interactive=false --appName=demo-service --nx-cloud=true --packageManager=npm`
        ),
        'Setup NX: '
      );
    } catch (e) {
      output.error(e);
    }
  }
}
