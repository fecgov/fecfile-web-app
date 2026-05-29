import { createEnvironment } from './environment.base';

export const environment = createEnvironment({
  production: false,
  name: 'stage',
  externalLinks: 'prod',
  baseUri: 'https://stage-api.fecfile.fec.gov',
});
