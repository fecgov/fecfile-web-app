/*

  The index file imports commands and adds them to Cypress

*/

import { safeType, overwrite} from './commands';
Cypress.Commands.add('safeType', { prevSubject: true }, safeType);
Cypress.Commands.add('overwrite', { prevSubject: true }, overwrite);
