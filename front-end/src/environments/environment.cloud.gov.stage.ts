import { createEnvironment } from './environment.base';

export const environment = createEnvironment({
  production: false,
  name: 'stage',
  environmentBanner: 'stage',
  externalLinks: 'prod',
  baseUri: 'https://stage-api.fecfile.fec.gov',
});
