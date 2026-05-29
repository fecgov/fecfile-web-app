import { createEnvironment } from './environment.base';

export const environment = createEnvironment({
  production: false,
  name: 'local',
  externalLinks: 'prod',
  baseUri: 'http://localhost:8080',
  overrides: {
    showGlossary: true,
  },
});
