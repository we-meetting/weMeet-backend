import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  RequestTimeoutException,
  mixin,
} from '@nestjs/common';

import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

export const TimeoutInterceptor = (timeouts: number) => {
  class MixinInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      return next.handle().pipe(
        timeout(timeouts),
        catchError((err) => {
          if (err instanceof TimeoutError) {
            return throwError(() => new RequestTimeoutException('요청 시간이 초과되었어요.'));
          }
          return throwError(() => err);
        }),
      );
    }
  }

  const Interceptor = mixin(MixinInterceptor);
  return Interceptor;
};
