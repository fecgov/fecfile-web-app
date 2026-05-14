import { createEnvironment } from './environment.base';

export const environment = createEnvironment({
  production: false,
  name: 'local',
  webForms: 'https://webforms.fec.gov',
  baseUri: 'http://localhost:8080',
  overrides: {
    showGlossary: true,
  },
});
