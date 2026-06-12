import { baseEnvironment, createEnvironment } from './environment.base';

export const environment = createEnvironment({
  production: true,
  name: 'prod',
  externalLinks: 'prod',
  baseUri: 'https://api.fecfile.fec.gov',
  overrides: {
    ffapiTimeoutCookieName: 'ffapi_timeout_prod',
    showForm3: false,
    showSchedF: false,
    enableImport: false,
    errorReporting: {
      ...baseEnvironment.errorReporting,
      sampleRates: {
        ...baseEnvironment.errorReporting.sampleRates,
        http4xx: 0.05,
      },
    },
  },
});
