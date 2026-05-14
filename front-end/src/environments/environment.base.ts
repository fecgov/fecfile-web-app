export const baseEnvironment = {
  production: false,
  appTitle: 'FECfile+',
  fecApiUrl: 'https://api.open.fec.gov/v1/',
  ffapiTimeoutCookieName: 'ffapi_timeout',
  userCanSetFilingFrequency: true,
  sessionIdCookieName: 'sessionid',
  committee_data_source: 'test',
  disableLogin: false,
  fecSpec: 8.5,
  showGlossary: false,
  showForm3: true,
  showSchedF: true,
  whoCanUseLink: 'https://www.fec.gov/efiling/who-can-use-fecfile-plus?dialog=open',
  errorReporting: {
    enabled: true,
    endpoint: '/frontend-error-report',
    sampleRates: { runtime: 1, promise: 1, http4xx: 1, http5xx: 1 },
    dedupeWindowMs: 30000,
    batchSize: 10,
    flushIntervalMs: 5000,
    maxMessageLength: 500,
    maxStackLength: 2000,
    maxPayloadBytes: 12000,
  },
};

export const createEnvironment = (params: {
  production: boolean;
  name: string;
  webForms: 'https://webforms.fec.gov' | 'https://webforms.stage.efo.fec.gov';
  baseUri: string;
  overrides?: Partial<typeof baseEnvironment>;
}) => {
  const apiUrl = `${params.baseUri}/api/v1`;

  return {
    ...baseEnvironment,
    ...params,
    apiUrl,
    webForms: params.webForms,
    form1m_link: `${params.webForms}/webforms/form1/index.htm`,
    loginDotGovAuthUrl: `${apiUrl}/oidc/authenticate`,
    loginDotGovLogoutUrl: `${apiUrl}/oidc/logout`,
    ffapiTimeoutCookieName: `ffapi_timeout_${params.name}`,
    ...params.overrides,
  };
};
