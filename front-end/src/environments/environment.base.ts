export const baseEnvironment = {
  production: false,
  appTitle: 'FECfile+',
  ffapiTimeoutCookieName: 'ffapi_timeout',
  userCanSetFilingFrequency: true,
  disableLogin: false,
  fecSpec: 8.5,
  IncludeMsaAndMsx: true,
  showGlossary: false,
  showForm3: true,
  showSchedF: true,
  enableImport: true,
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
  externalLinks: 'stage' | 'prod';
  baseUri: string;
  overrides?: Partial<typeof baseEnvironment>;
}) => {
  const apiUrl = `${params.baseUri}/api/v1`;
  const webForms = params.externalLinks === 'prod' ? 'https://webforms.fec.gov' : 'https://webforms.stage.efo.fec.gov';
  return {
    ...baseEnvironment,
    ...params,
    apiUrl,
    webForms,
    form1_link: `${webForms}/webforms/form1/index.htm`,
    loginDotGovAuthUrl: `${apiUrl}/oidc/authenticate`,
    loginDotGovLogoutUrl: `${apiUrl}/oidc/logout`,
    ffapiTimeoutCookieName: `ffapi_timeout_${params.name}`,
    ...params.overrides,
  };
};
