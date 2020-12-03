import {
  BuilderContext,
  BuilderOutput,
  createBuilder,
} from '@angular-devkit/architect';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BuildBuilderSchema } from './schema';

export function runBuilder(
  options: BuildBuilderSchema,
  context: BuilderContext
): Observable<BuilderOutput> {
  return of({ success: true }).pipe(
    tap(() => {
      context.logger.info('Builder ran for build');
    })
  );
}

export default createBuilder(runBuilder);
