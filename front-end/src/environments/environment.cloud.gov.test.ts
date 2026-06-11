import { createEnvironment } from './environment.base';

export const environment = createEnvironment({
  production: true,
  name: 'test',
  externalLinks: 'stage',
  baseUri: 'https://test-api.fecfile.fec.gov',
  overrides: {
    showForm3: false,
    showSchedF: false,
    enableImport: false,
    whoCanUseLink:
      'https://www.fec.gov/help-candidates-and-committees/filing-reports/electronic-filing/create-fecfile-plus-test-committee/',
  },
});
