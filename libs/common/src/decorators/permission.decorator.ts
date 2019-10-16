import 'reflect-metadata';

export const PERMISSION_DEFINITION = '__permission_definition__';

export function Permission(options: {
  name: string, identify: string, action: 'create' | 'read' | 'update' | 'delete',
}) {
  return (target: any, propertyKey: string) => {
    Reflect.defineMetadata(PERMISSION_DEFINITION, options, target, propertyKey);
  };
}
