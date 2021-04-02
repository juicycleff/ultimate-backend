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
 * File name:         output.ts
 * Last modified:     24/03/2021, 23:20
 ******************************************************************************/

import chalk from 'chalk';
import * as cliSpinners from 'cli-spinners';

export interface CLIErrorMessageConfig {
  title: string;
  bodyLines?: string[];
  slug?: string;
}

export interface CLIWarnMessageConfig {
  title: string;
  bodyLines?: string[];
  slug?: string;
}

export interface CLILogMessageConfig {
  title: string;
  bodyLines?: string[];
}

export interface CLINoteMessageConfig {
  title: string;
  bodyLines?: string[];
}

export interface CLISuccessMessageConfig {
  title: string;
}

/**
 * Automatically disable styling applied by chalk if CI=true
 */
if (process.env.CI === 'true') {
  (chalk as any).Level = 0;
}

class CLIOutput {
  private readonly UB_PREFIX = `${chalk.cyan(
    '>'
  )} ${chalk.reset.inverse.bold.cyan(' UB ')}`;
  /**
   * Longer dash character which forms more of a continuous line when place side to side
   * with itself, unlike the standard dash character
   */
  private readonly VERTICAL_SEPARATOR =
    '———————————————————————————————————————————————';

  /**
   * Expose some color and other utility functions so that other parts of the codebase that need
   * more fine-grained control of message bodies are still using a centralized
   * implementation.
   */
  colors = {
    gray: chalk.gray,
  };
  bold = chalk.bold;
  underline = chalk.underline;

  private writeToStdOut(str: string) {
    process.stdout.write(str);
  }

  private writeOutputTitle({
    label,
    title,
  }: {
    label?: string;
    title: string;
  }): void {
    let outputTitle: string;
    if (label) {
      outputTitle = `${this.UB_PREFIX} ${label} ${title}\n`;
    } else {
      outputTitle = `${this.UB_PREFIX} ${title}\n`;
    }
    this.writeToStdOut(outputTitle);
  }

  private writeOptionalOutputBody(bodyLines?: string[]): void {
    if (!bodyLines) {
      return;
    }
    this.addNewline();
    bodyLines.forEach((bodyLine) => this.writeToStdOut(`  ${bodyLine}\n`));
  }

  addNewline() {
    this.writeToStdOut('\n');
  }

  addVerticalSeparator() {
    this.writeToStdOut(`\n${chalk.gray(this.VERTICAL_SEPARATOR)}\n\n`);
  }

  error({ title, slug, bodyLines }: CLIErrorMessageConfig) {
    this.addNewline();

    this.writeOutputTitle({
      label: chalk.reset.inverse.bold.red(' ERROR '),
      title: chalk.bold.red(title),
    });

    this.writeOptionalOutputBody(bodyLines);

    /**
     * Optional slug to be used in an UB error message redirect URL
     */
    if (slug && typeof slug === 'string') {
      this.addNewline();
      this.writeToStdOut(
        `${chalk.grey(
          '  Learn more about this error: '
        )}https://errors.UB.dev/${slug}\n`
      );
    }

    this.addNewline();
  }

  warn({ title, slug, bodyLines }: CLIWarnMessageConfig) {
    this.addNewline();

    this.writeOutputTitle({
      label: chalk.reset.inverse.bold.yellow(' WARNING '),
      title: chalk.bold.yellow(title),
    });

    this.writeOptionalOutputBody(bodyLines);

    /**
     * Optional slug to be used in an UB warning message redirect URL
     */
    if (slug && typeof slug === 'string') {
      this.addNewline();
      this.writeToStdOut(
        `${chalk.grey(
          '  Learn more about this warning: '
        )}https://errors.UB.dev/${slug}\n`
      );
    }

    this.addNewline();
  }

  note({ title, bodyLines }: CLINoteMessageConfig) {
    this.addNewline();

    this.writeOutputTitle({
      label: chalk.reset.inverse.bold.keyword('orange')(' NOTE '),
      title: chalk.bold.keyword('orange')(title),
    });

    this.writeOptionalOutputBody(bodyLines);

    this.addNewline();
  }

  success({ title }: CLISuccessMessageConfig) {
    this.addNewline();

    this.writeOutputTitle({
      label: chalk.reset.inverse.bold.green(' SUCCESS '),
      title: chalk.bold.green(title),
    });

    this.addNewline();
  }

  logSingleLine(message: string) {
    this.addNewline();

    this.writeOutputTitle({
      title: message,
    });

    this.addNewline();
  }

  log({ title, bodyLines }: CLIWarnMessageConfig) {
    this.addNewline();

    this.writeOutputTitle({
      title: chalk.white(title),
    });

    this.writeOptionalOutputBody(bodyLines);

    this.addNewline();
  }

  logSpinner(description: string) {
    this.addNewline();

    console.log(cliSpinners.dots, ' ' + description);

    this.addNewline();
  }
}

export const output = new CLIOutput();
