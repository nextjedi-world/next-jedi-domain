import type { NjConfig } from '../app/core/config';

/**
 * Production. Hosts follow platform docs/CONTRACTS.md: Identity at auth.nextjedi.com and
 * platform-api at api.nextjedi.com (both on the Azure dev subscription for now).
 */
export const environment: NjConfig = {
  identityIssuer: 'https://auth.nextjedi.com',
  oidcClientId: 'nextjedi-web',
  platformApiUrl: 'https://api.nextjedi.com',
  workspace: 'nextjedi',
  useMock: false,
};
