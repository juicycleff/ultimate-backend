import { SetMetadata } from '@nestjs/common';
import { RESOLVE_REFERENCE_METADATA } from '../tokens';

export function ResolveReference(): MethodDecorator {
  // tslint:disable-next-line
  return (target: object | Function, key?: string | symbol, descriptor?: any) => {
    SetMetadata(RESOLVE_REFERENCE_METADATA, true)(target, key, descriptor);
  };
}
