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
 * File name:         ub.ts
 * Last modified:     24/03/2021, 12:32
 ******************************************************************************/
const commander = require('commander');
import chalk from 'chalk';
const npmPackage = require('../package.json');
import { commands } from '../src/commands';
import { findProjectRoot, output } from '../src/utils';

const project = findProjectRoot(process.cwd());
if (!project) {
  output.log({
    title: `The current directory isn't part of an Ultimate-Backend or Nx project.`,
    bodyLines: [
      `To create a project run:`,
      chalk.bold.white(`ub project create <project name>`),
    ],
  });

  output.note({
    title: `For more information please visit https://ultimate-backend.xraph.com/`,
  });
  process.exit(1);
}

console.log(project);

const program = new commander.Command();
program.version(
  npmPackage.version,
  '-v, --version, --vers',
  'output the current version'
);

for (const c of commands) {
  program.addCommand(c);
}

program.parse(process.argv);
