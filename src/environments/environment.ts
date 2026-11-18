import type { NjConfig } from '../app/core/config';

/**
 * Local defaults: the real stack from the Phase 1 contract (Identity on :4000, platform-api on
 * :4100). `ng serve --configuration mock` swaps in environment.mock.ts instead.
 */
export const environment: NjConfig = {
  identityIssuer: 'http://localhost:4000',
  oidcClientId: 'nextjedi-web',
  platformApiUrl: 'http://localhost:4100',
  workspace: 'nextjedi',
  useMock: false,
};
