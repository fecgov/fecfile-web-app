// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --configuration=cloud.gov.prod` replaces `environment.ts` with `environment.cloud.gov.test.ts`.
// The list of file replacements can be found in `angular.json`.

const apiUrl = 'https://test-api.fecfile.fec.gov/api/v1';
export const environment = {
  production: true,
  name: 'test',
  apiUrl: apiUrl,
  appTitle: 'FECfile+',
  dcfConverterApiUrl: 'https://dev-efile-api.efdev.fec.gov/dcf_converter/v1',
  fecApiUrl: 'https://api.open.fec.gov/v1/',
  userCanSetFilingFrequency: true,
  loginDotGovAuthUrl: `${apiUrl}/oidc/authenticate`,
  loginDotGovLogoutUrl: `${apiUrl}/oidc/logout`,
  ffapiTimeoutCookieName: 'ffapi_timeout_test',
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
