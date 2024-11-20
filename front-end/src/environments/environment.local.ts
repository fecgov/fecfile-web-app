const apiUrl = 'http://localhost:8080/api/v1';
export const environment = {
  production: false,
  name: 'local',
  apiUrl: apiUrl,
  appTitle: 'FECfile',
  dcfConverterApiUrl: 'https://dev-efile-api.efdev.fec.gov/dcf_converter/v1',
  fecApiUrl: 'https://api.open.fec.gov/v1/',
  userCanSetFilingFrequency: true,
  loginDotGovAuthUrl: `${apiUrl}/oidc/authenticate`,
  loginDotGovLogoutUrl: `${apiUrl}/oidc/logout`,
  ffapiLoginDotGovCookieName: 'ffapi_login_dot_gov',
  sessionIdCookieName: 'sessionid',
  committee_data_source: 'test',
  form1m_link: 'https://webforms.stage.efo.fec.gov/webforms/form1/index.htm',
};
