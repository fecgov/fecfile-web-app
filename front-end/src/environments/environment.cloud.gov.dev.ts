import { createEnvironment } from './environment.base';

export const environment = createEnvironment({
  production: false,
  name: 'development',
  webForms: 'https://webforms.fec.gov',
  baseUri: 'https://dev-api.fecfile.fec.gov',
  overrides: {
    ffapiTimeoutCookieName: 'ffapi_timeout_dev',
  },
});
