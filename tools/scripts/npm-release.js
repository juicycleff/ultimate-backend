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
 * File name:         npm-release.js
 * Last modified:     18/03/2021, 16:08
 ******************************************************************************/
const shell = require('shelljs');
const fs = require('fs');
const path = require('path');

function getBuildType(msg = '') {
  if (msg.startsWith('feat')) {
    return 'major';
  } else if (
    msg.startsWith('fix') ||
    msg.startsWith('refactor') ||
    msg.startsWith('docs') ||
    msg.startsWith('chore')
  ) {
    return 'patch';
  } else {
    return 'minor';
  }
}

function command() {
  const projects = [];
  let commitMessage;
  let dryRun = false;
  let releaseType = 'minor' | 'patch' | 'major';

  // remove dist and get commit message
  try {
    console.info('Removing Dist');
    shell.exec(`rm -rf dist`);
    commitMessage = shell.exec("git log -1 --pretty=format:'%s'").stdout;
    releaseType = getBuildType(commitMessage);
  } catch (e) {
    return;
  }

  // get affected libs
  try {
    shell.exec(`rm -rf dist`);
    const strResponse = shell.exec(
      `npm run affected:libs --plain --exclude="messaging,gateway"`
    );
    let tempProject = strResponse.stdout.split('\n');
    tempProject = tempProject.splice(10);

    for (const project of tempProject) {
      if (project.length > 0) {
        projects.push(project.slice(4, project.length));
      }
    }
  } catch (e) {
    //
  }

  if (projects.length === 0) {
    console.info('No packages to publish');
    return;
  }

  // Build
  for (let project of projects) {
    if (project !== 'gateway' || project !== 'messaging') {
      console.info(`Building ${project}`);
      shell.exec(`nx run ${project}:build --with-deps --optimization --progress --extractLicenses`);
    }
  }

  // Publish
  for (let project of projects) {
    if (project !== 'gateway' || project !== 'messaging') {
      // shell.exec(`cd dist/packages/${project} && npm publish --access public`);
      // shell.exec('cd ../../../');
    }
  }
}

command();
