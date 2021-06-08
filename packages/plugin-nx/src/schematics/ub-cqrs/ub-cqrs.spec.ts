import { Tree } from '@angular-devkit/schematics';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';

import { UBCQRSSchema } from './schema';

describe('nestjs-schematics schematic', () => {
  let appTree: Tree;
  const options: UBCQRSSchema = {
    name: 'test',
    unitTestRunner: 'jest',
    type: 'event',
    project: 'api',
    flat: false,
  };

  beforeEach(() => {
    appTree = createEmptyWorkspace(Tree.empty());
    appTree.overwrite(
      'workspace.json',
      String.raw`
      {
        "projects": {
         "api": {
            "root": "apps/api",
            "sourceRoot": "apps/api/src",
            "projectType": "application",
            "prefix": "api",
            "schematics": {},
            "architect":{}
         }
        }
      }
    `
    );
  });
  /*
  test.each(testTypes)('%p should run successfully', async (type) => {
    await expect(
      runSchematic(type, options, appTree)
    ).resolves.not.toThrowError();
  });
  */
});
