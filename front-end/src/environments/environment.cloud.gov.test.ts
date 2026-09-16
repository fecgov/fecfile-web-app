import { createEnvironment } from './environment.base';

export const environment = createEnvironment({
  production: true,
  name: 'test',
  environmentBanner: 'test',
  externalLinks: 'stage',
  baseUri: 'https://test-api.fecfile.fec.gov',
  overrides: {
    whoCanUseLink:
      'https://www.fec.gov/help-candidates-and-committees/filing-reports/electronic-filing/create-fecfile-plus-test-committee/',
  },
  featureFlags: {
    showForm3: false,
    showSchedF: false,
    enableImport: false,
    manualReportVersion: false,
  },
});
