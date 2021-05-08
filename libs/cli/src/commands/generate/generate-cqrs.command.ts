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
 * File name:         add-module.command.ts
 * Last modified:     24/03/2021, 19:42
 ******************************************************************************/
import { ArrayOption, ICommand } from '../../interfaces';
import { Command } from 'commander';
import { execSync } from 'child_process';
import { output } from '../../utils';

export class GenerateCqrsCommand implements ICommand {
  constructor(program: Command) {
    program
      .command(this.command)
      .action(this.action)
      .description(this.description)
      .option(...this.option[0])
      .option(...this.option[1])
      .option(...this.option[2]);
  }

  command = 'cqrs <handler-name>';

  option: ArrayOption = [
    ['-s, --service <service>', 'the ub service to target'],
    [
      '-d, --directory <directory>',
      'directory where the generated files are placed',
    ],
    [
      '-g, --group <group>',
      'group generated file by folder',
    ],
  ];

  description = 'generate cqrs handlers for service';

  action(handlerName, options, command, ...rest): void {
    let cmd = `npx nx g @ultimate-backend/plugin-nx:cqrs ${handlerName}`;
    if (options.service) {
      cmd = cmd + ` -p ${options.service}`;
    }
    if (options.directory) {
      cmd = cmd + ` -d ${options.directory}`;
    }
    if (options.group) {
      cmd = cmd + ` -g ${options.group}`;
    }

    try {
      execSync(cmd, {
        stdio: [0, 1, 2],
      });
    } catch (e) {
      output.error({
        title: 'Error creating service',
        bodyLines: [e],
      });
    }
  }
}
