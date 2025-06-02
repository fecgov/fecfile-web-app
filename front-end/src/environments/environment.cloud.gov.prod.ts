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
  ffapiLoginDotGovCookieName: 'ffapi_login_dot_gov',
  sessionIdCookieName: 'sessionid',
  committee_data_source: 'production',
  form1m_link: 'https://webforms.fec.gov/webforms/form1/index.htm',
  showForm3: false,
  showSchedF: false,
  disableLogin: true,
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
