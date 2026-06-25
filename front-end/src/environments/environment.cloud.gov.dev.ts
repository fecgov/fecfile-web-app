import { createEnvironment } from './environment.base';

export const environment = createEnvironment({
  production: false,
  name: 'development',
  externalLinks: 'prod',
  baseUri: 'https://load-dev-api.app.cloud.gov',
  overrides: {
    ffapiTimeoutCookieName: 'ffapi_timeout_dev',
  },
});
