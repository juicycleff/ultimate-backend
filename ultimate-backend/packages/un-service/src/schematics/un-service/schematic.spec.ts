import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { join } from 'path';

import { UnServiceSchematicSchema } from './schema';

describe('un-service schematic', () => {
  let appTree: Tree;
  const options: UnServiceSchematicSchema = { name: 'test' };

  const testRunner = new SchematicTestRunner(
    '@ultimate-backend/un-service',
    join(__dirname, '../../../collection.json')
  );

  beforeEach(() => {
    appTree = createEmptyWorkspace(Tree.empty());
  });

  it('should run successfully', async () => {
    await expect(
      testRunner.runSchematicAsync('un-service', options, appTree).toPromise()
    ).resolves.not.toThrowError();
  });
});
