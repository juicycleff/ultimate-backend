import {
  apply,
  chain,
  mergeWith,
  move,
  Rule,
  SchematicContext,
  Tree,
  url,
  externalSchematic,
} from '@angular-devkit/schematics';
import { getProjectConfig } from '@nrwl/workspace';
import { Schema } from './schema';

function generateNestApplication(schema: any): Rule {
  return externalSchematic('@nrwl/node', 'application', schema);
}

function generateServiceStructure(schema: any): Rule {
  return (tree: Tree, context: SchematicContext) => {
    context.logger.info('adding NOTES.md to lib');

    const templateSource = apply(url('./files'), [
      move(getProjectConfig(tree, schema.name).root),
    ]);

    return chain([mergeWith(templateSource)])(tree, context);
  };
}

export default function (schema: Schema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    let pipeline = [
      generateNestApplication(schema),
      generateServiceStructure(schema),
    ];

    return chain(pipeline)(tree, context);
  };
}
