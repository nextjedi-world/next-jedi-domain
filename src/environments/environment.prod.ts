import type { NjConfig } from '../app/core/config';

/**
 * Production. Identity and platform-api are not deployed yet (Phase 1 runs locally), so these
 * hostnames are placeholders to confirm before this ships.
 */
export const environment: NjConfig = {
  identityIssuer: 'https://id.nextjedi.com',
  oidcClientId: 'nextjedi-web',
  platformApiUrl: 'https://api.nextjedi.com',
  workspace: 'nextjedi',
  useMock: false,
};
