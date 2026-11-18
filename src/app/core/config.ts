import { InjectionToken } from '@angular/core';
import { environment } from '../../environments/environment';

/** Where nextjedi.com finds NextJedi Identity and platform-api. Chosen per build configuration. */
export interface NjConfig {
  /** OIDC issuer (NextJedi Identity). Discovery lives at `<issuer>/.well-known/openid-configuration`. */
  identityIssuer: string;
  /** Public OIDC client (Authorization Code + PKCE, no secret). */
  oidcClientId: string;
  /** platform-api base URL. The Bearer token is only ever sent to this origin. */
  platformApiUrl: string;
  /** platform-api workspace (`ws`). */
  workspace: string;
  /** Serve platform-api and sign-in from the in-browser dev mock (core/mock). */
  useMock: boolean;
}

export const NJ_CONFIG = new InjectionToken<NjConfig>('NJ_CONFIG', {
  providedIn: 'root',
  factory: () => environment,
});

/** True when `url` targets platform-api (same origin and path prefix). */
export function isPlatformApiUrl(url: string, config: NjConfig): boolean {
  const base = config.platformApiUrl.replace(/\/+$/, '');
  return url === base || url.startsWith(base + '/');
}
