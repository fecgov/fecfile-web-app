import { createEnvironment } from './environment.base';

export const environment = createEnvironment({
  production: false,
  name: 'stage',
  webForms: 'https://webforms.fec.gov',
  baseUri: 'https://stage-api.fecfile.fec.gov',
});
