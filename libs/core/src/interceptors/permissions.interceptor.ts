import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
  AccessTokenRpcClientService,
  RolesRpcClientService,
} from '../services';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class PermissionsInterceptor implements NestInterceptor {
  constructor(
    public readonly access: AccessTokenRpcClientService,
    public readonly role: RolesRpcClientService,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const ctx = GqlExecutionContext.create(context).getContext();
    console.log('Before...');

    const now = Date.now();
    return next
      .handle()
      .pipe(tap(() => console.log(`After... ${Date.now() - now}ms`)));
  }
}
