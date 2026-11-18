import type { NjConfig } from '../app/core/config';

/**
 * Production backend from a local build: `make docker-prod` serves this at
 * https://nextjedi.tail7ddaf8.ts.net:4443 (tailnet only). Identity runs at auth.nextjedi.com;
 * platform-api uses its Container Apps address until api.nextjedi.com is decided.
 */
export const environment: NjConfig = {
  identityIssuer: 'https://auth.nextjedi.com',
  oidcClientId: 'nextjedi-web',
  platformApiUrl:
    'https://ca-platform-api-dev.politeglacier-1ee8565f.centralindia.azurecontainerapps.io',
  workspace: 'nextjedi',
  useMock: false,
};
