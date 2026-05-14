import { baseEnvironment, createEnvironment } from './environment.base';

export const environment = createEnvironment({
  production: true,
  name: 'prod',
  webForms: 'https://webforms.fec.gov',
  baseUri: 'https://api.fecfile.fec.gov',
  overrides: {
    committee_data_source: 'production',
    ffapiTimeoutCookieName: 'ffapi_timeout_prod',
    showForm3: false,
    showSchedF: false,
    errorReporting: {
      ...baseEnvironment.errorReporting,
      sampleRates: {
        ...baseEnvironment.errorReporting.sampleRates,
        http4xx: 0.05,
      },
    },
  },
});
