import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { CanActivateFn, Router } from '@angular/router';
import { filter, map, take } from 'rxjs';
import { AuthService } from './auth.service';

/** Lets signed-in people through; sends everyone else to /sign-in with a return URL. */
export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const decide = () =>
    auth.isAuthenticated()
      ? true
      : router.createUrlTree(['/sign-in'], { queryParams: { returnUrl: state.url } });
  if (auth.ready()) return decide();
  return toObservable(auth.ready).pipe(
    filter(Boolean),
    take(1),
    map(() => decide()),
  );
};
