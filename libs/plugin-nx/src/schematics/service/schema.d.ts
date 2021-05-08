import { UnitTestRunner } from '../../utils/test-runners';
import { Linter } from 'tslint';

type UBServiceTransType = 'rest' | 'grpc' | 'graphql';
type UBServiceType = 'api' | 'svc' | 'gateway';
type UBFeatures = 'auth' | 'multi-tenancy';

export interface Schema {
  name: string;
  port: number;
  transport: Array<UBServiceTransType>;
  kind: UBServiceType;
  features?: Array<UBFeatures>;
  skipFormat: boolean;
  skipPackageJson: boolean;
  directory?: string;
  unitTestRunner: UnitTestRunner;
  tags?: string;
  linter: Linter;
}
