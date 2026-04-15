// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --configuration=cloud.gov.prod` replaces `environment.ts` with `environment.cloud.gov.prod.ts`.
// The list of file replacements can be found in `angular.json`.

const apiUrl = 'https://api.fecfile.fec.gov/api/v1';
export const environment = {
  production: true,
  name: 'production',
  apiUrl: apiUrl,
  appTitle: 'FECfile+',
  dcfConverterApiUrl: 'https://dev-efile-api.efdev.fec.gov/dcf_converter/v1',
  fecApiUrl: 'https://api.open.fec.gov/v1/',
  userCanSetFilingFrequency: true,
  loginDotGovAuthUrl: `${apiUrl}/oidc/authenticate`,
  ffapiTimeoutCookieName: 'ffapi_timeout_prod',
  loginDotGovLogoutUrl: `${apiUrl}/oidc/logout`,
  sessionIdCookieName: 'sessionid',
  committee_data_source: 'production',
  form1m_link: 'https://webforms.fec.gov/webforms/form1/index.htm',
  showForm3: false,
  showSchedF: false,
  disableLogin: true,
  fecSpec: 8.5,
  showGlossary: false,
  webForms: 'https://webforms.fec.gov',
  whoCanUseLink: 'https://www.fec.gov/efiling/who-can-use-fecfile-plus?dialog=open',
  errorReporting: {
    enabled: true,
    endpoint: '/frontend-error-report',
    sampleRates: {
      runtime: 0.5,
      promise: 0.5,
      http4xx: 0.05,
      http5xx: 1,
    },
    dedupeWindowMs: 30000,
    batchSize: 10,
    flushIntervalMs: 5000,
    maxMessageLength: 500,
    maxStackLength: 2000,
    maxPayloadBytes: 12000,
  },
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
