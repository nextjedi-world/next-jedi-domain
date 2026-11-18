import type { NjConfig } from '../app/core/config';

/** Dev mock: platform-api calls and sign-in are served in the browser (core/mock). */
export const environment: NjConfig = {
  identityIssuer: 'http://localhost:4000',
  oidcClientId: 'nextjedi-web',
  platformApiUrl: 'http://localhost:4100',
  workspace: 'nextjedi',
  useMock: true,
};
