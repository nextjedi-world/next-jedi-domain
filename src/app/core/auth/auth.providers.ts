import {
  EnvironmentProviders,
  Provider,
  inject,
  makeEnvironmentProviders,
  provideAppInitializer,
} from '@angular/core';
import { LogLevel, provideAuth } from 'angular-auth-oidc-client';
import { NjConfig } from '../config';
import { AuthService } from './auth.service';
import { MockAuthService } from './mock-auth.service';
import { OidcAuthService } from './oidc-auth.service';

export const OIDC_SCOPE = 'openid profile email offline_access';

/** Sign-in for the app: real OIDC against Identity, or the dev mock when `useMock` is on. */
export function provideNjAuth(config: NjConfig): EnvironmentProviders {
  // Restore the session in the background; pages and the guard read `ready`.
  const restore = provideAppInitializer(() => {
    void inject(AuthService).init();
  });
  const providers: (Provider | EnvironmentProviders)[] = config.useMock
    ? [{ provide: AuthService, useClass: MockAuthService }]
    : [
        provideAuth({
          config: {
            authority: config.identityIssuer,
            clientId: config.oidcClientId,
            redirectUrl: `${globalThis.location?.origin ?? ''}/auth/callback`,
            postLogoutRedirectUri: `${globalThis.location?.origin ?? ''}/`,
            scope: OIDC_SCOPE,
            responseType: 'code',
            silentRenew: true,
            useRefreshToken: true,
            ignoreNonceAfterRefresh: true,
            renewTimeBeforeTokenExpiresInSeconds: 30,
            autoUserInfo: true,
            logLevel: LogLevel.Warn,
          },
        }),
        { provide: AuthService, useClass: OidcAuthService },
      ];
  return makeEnvironmentProviders([...providers, restore]);
}
