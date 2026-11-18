import { HttpErrorResponse, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, from, switchMap, throwError } from 'rxjs';
import { NJ_CONFIG, isPlatformApiUrl } from '../config';
import { AuthService } from './auth.service';
import { SKIP_AUTH } from './skip-auth';

function withToken(req: HttpRequest<unknown>, token: string | null): HttpRequest<unknown> {
  return token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;
}

/**
 * Adds `Authorization: Bearer <access_token>` to platform-api requests only (never to Identity or
 * any other origin). On a 401 it refreshes once with the refresh token and retries.
 */
export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const config = inject(NJ_CONFIG);
  if (!isPlatformApiUrl(req.url, config) || req.context.get(SKIP_AUTH)) return next(req);
  const auth = inject(AuthService);

  return from(auth.getAccessToken()).pipe(
    switchMap((token) =>
      next(withToken(req, token)).pipe(
        catchError((err: unknown) => {
          if (!token || !(err instanceof HttpErrorResponse) || err.status !== 401) {
            return throwError(() => err);
          }
          return from(auth.refresh()).pipe(
            switchMap((fresh) => (fresh ? next(withToken(req, fresh)) : throwError(() => err))),
          );
        }),
      ),
    ),
  );
};
