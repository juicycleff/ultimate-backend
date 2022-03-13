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
 * File name:         index.ts
 * Last modified:     24/03/2021, 20:18
 ******************************************************************************/
const { Command } = require('commander');
import { GenClassCommand } from './gen-class.command';
import { GenControllerCommand } from './gen-controller.command';
import { GenDecoratorCommand } from './gen-decorator.command';
import { GenFilterCommand } from './gen-filter.command';
import { GenGatewayCommand } from './gen-gateway.command';
import { GenGuardCommand } from './gen-guard.command';
import { GenInterceptorCommand } from './gen-interceptor.command';
import { GenInterfaceCommand } from './gen-interface.command';
import { GenModuleCommand } from './gen-module.command';
import { GenPipeCommand } from './gen-pipe.command';
import { GenProviderCommand } from './gen-provider.command';
import { GenResolverCommand } from './gen-resolver.command';
import { GenServiceCommand } from './gen-service.command';

const nestCommand = new Command('nest');
nestCommand.description('nestjs providers generator');

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const commands = [
  new GenControllerCommand(nestCommand),
  new GenDecoratorCommand(nestCommand),
  new GenFilterCommand(nestCommand),
  new GenModuleCommand(nestCommand),
  new GenClassCommand(nestCommand),
  new GenPipeCommand(nestCommand),
  new GenProviderCommand(nestCommand),
  new GenResolverCommand(nestCommand),
  new GenServiceCommand(nestCommand),
  new GenInterfaceCommand(nestCommand),
  new GenInterceptorCommand(nestCommand),
  new GenGatewayCommand(nestCommand),
  new GenGuardCommand(nestCommand),
];
export const nestCommands = nestCommand;
