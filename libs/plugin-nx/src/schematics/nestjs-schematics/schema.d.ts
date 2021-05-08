export interface NestSchematicsSchema {
  type:
    | 'nest-class'
    | 'nest-controller'
    | 'nest-decorator'
    | 'nest-filter'
    | 'nest-gateway'
    | 'nest-guard'
    | 'nest-interceptor'
    | 'nest-interface'
    | 'nest-middleware'
    | 'nest-module'
    | 'nest-pipe'
    | 'nest-provider'
    | 'nest-resolver'
    | 'nest-service';
  name: string;
  project: string;
  unitTestRunner: 'jest' | 'none';
  directory?: string;
  path?: string;
  flat: boolean;
  // Additional Nest schematic properties
  module?: string;
  skipImport?: string;
  language?: string;
  spec?: boolean;
}
