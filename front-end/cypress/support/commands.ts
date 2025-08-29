function safeString(stringVal: string | number | undefined | null): string {
  if (stringVal === null || stringVal === undefined) {
    return '';
  } else {
    return stringVal.toString();
  }
}

export function safeType(prevSubject: any, stringVal: string | number) {
  const subject = cy.wrap(prevSubject);
  const outString: string = safeString(stringVal);

  if (outString.length != 0) {
    subject.type(outString);
  }

  return subject; //Allows Cypress methods to chain off of this command like normal (IE Cy.get().safe_type().parent().click() and so on)
}

export function overwrite(prevSubject: any, stringVal: string | number) {
  const outString = safeString(stringVal);

  return safeType(prevSubject, '{selectall}{del}' + outString);
}

import 'browserstack-cypress-cli/bin/testObservability/cypress';
