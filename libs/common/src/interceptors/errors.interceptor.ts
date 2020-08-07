import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof HttpException) {
          return Promise.resolve({
            code: error.getStatus(),
            message: error.getResponse(),
          });
        }
        if (error.code && error.details) {
          return Promise.resolve({
            code: error.code,
            message: error.details,
          });
        }
      }),
    );
  }
}
