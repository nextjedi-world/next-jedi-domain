import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, firstValueFrom, isObservable } from 'rxjs';
import { FakeAuthService, TEST_USER } from '../testing';
import { authGuard } from './auth.guard';
import { AuthService } from './auth.service';

describe('authGuard', () => {
  let auth: FakeAuthService;
  const state = { url: '/account' } as RouterStateSnapshot;
  const run = () =>
    TestBed.runInInjectionContext(() => authGuard({} as ActivatedRouteSnapshot, state));

  beforeEach(() => {
    auth = new FakeAuthService();
    TestBed.configureTestingModule({ providers: [{ provide: AuthService, useValue: auth }] });
  });

  it('lets signed-in people through', () => {
    auth.userSig.set(TEST_USER);
    expect(run()).toBe(true);
  });

  it('sends signed-out people to /sign-in with a return URL', () => {
    const result = run() as UrlTree;
    expect(TestBed.inject(Router).serializeUrl(result)).toBe('/sign-in?returnUrl=%2Faccount');
  });

  it('waits for the session check before deciding', async () => {
    auth.readySig.set(false);
    const result = run();
    expect(isObservable(result)).toBe(true);
    const pending = firstValueFrom(result as Observable<boolean | UrlTree>);
    auth.userSig.set(TEST_USER);
    auth.readySig.set(true);
    TestBed.tick();
    expect(await pending).toBe(true);
  });
});
