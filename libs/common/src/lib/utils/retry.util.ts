import { Observable } from 'rxjs';
import { delay, retryWhen, scan } from 'rxjs/operators';
import { Logger } from '@nestjs/common';

export function handleRetry(
  retryAttempts = 9,
  retryDelay = 3000,
  context = 'handleRetry'
): <T>(source: Observable<T>) => Observable<T> {
  const logger = new Logger(context);
  return <T>(source: Observable<T>) =>
    source.pipe(
      retryWhen((e) =>
        e.pipe(
          scan((errorCount, error) => {
            logger.error(
              `Unable to connect to the client. Retrying (${
                errorCount + 1
              })...`,
              ''
            );
            if (errorCount + 1 >= retryAttempts) {
              throw error;
            }
            return errorCount + 1;
          }, 0),
          delay(retryDelay)
        )
      )
    );
}
