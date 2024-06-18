const apiBaseUrl = 'http://localhost:8080';
export const environment = {
  production: false,
  name: 'local',
  apiUrl: `${apiBaseUrl}/api/v1`,
  appTitle: 'FECfile',
  dcfConverterApiUrl: 'https://dev-efile-api.efdev.fec.gov/dcf_converter/v1',
  fecApiUrl: 'https://api.open.fec.gov/v1/',
  userCanSetFilingFrequency: true,
  loginDotGovAuthUrl: `${apiBaseUrl}/oidc/authenticate`,
  loginDotGovLogoutUrl: `${apiBaseUrl}/oidc/logout`,
  ffapiLoginDotGovCookieName: 'ffapi_login_dot_gov',
  sessionIdCookieName: 'sessionid',
};
