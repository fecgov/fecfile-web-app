// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --configuration=cloud.gov.dev` replaces `environment.ts` with `environment.cloud.gov.dev.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  name: 'development',
  apiUrl: 'https://localhost/api/v1',
  appTitle: 'FECfile+',
  dcfConverterApiUrl: 'https://dev-efile-api.efdev.fec.gov/dcf_converter/v1',
  fecApiUrl: 'https://api.open.fec.gov/v1/',
  userCanSetFilingFrequency: true,
  loginDotGovAuthUrl: 'http://localhost:8080/oidc/authenticate',
  loginDotGovLogoutUrl: '',
  ffapiTimeoutCookieName: 'ffapi_timeout',
  ffapiLoginDotGovCookieName: 'ffapi_login_dot_gov',
  sessionIdCookieName: 'sessionid',
  committee_data_source: 'test',
  form1m_link: 'https://webforms.stage.efo.fec.gov/webforms/form1/index.htm',
  showForm3: false,
  showSchedF: false,
  disableLogin: false,
  fecSpec: 8.4,
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
