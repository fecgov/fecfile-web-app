import { createEnvironment } from './environment.base';

export const environment = createEnvironment({
  production: true,
  name: 'local',
  webForms: 'https://webforms.stage.efo.fec.gov',
  baseUri: 'https://test-api.fecfile.fec.gov',
  overrides: {
    showForm3: false,
    showSchedF: false,
  },
});
