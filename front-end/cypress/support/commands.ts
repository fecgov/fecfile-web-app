// --- Manage Users helpers ---
// Types for new commands
// import type { Chainable } from 'cypress';
// Use the global Cypress namespace for type declarations below.

declare global {
  namespace Cypress {
    interface Chainable {
      safeType(value: string | number | null | undefined): Chainable<Subject>;
    }
  }
}

// ***********************************************


function safeString(stringVal: string | number | undefined | null): string {
  if (stringVal === null || stringVal === undefined) {
    return '';
  } else {
    return stringVal.toString();
  }
}

Cypress.Commands.add(
  'safeType',
  { prevSubject: 'element' },
  (subject: JQuery<HTMLElement>, value: string | number | null | undefined) => {
    const text = safeString(value);
    if (text.length) {
      cy.wrap(subject).type(text);
    }
    // Always return the subject so you can keep chaining
    return cy.wrap(subject);
  }
);

export function overwrite(prevSubject: any, stringVal: string | number) {
  const outString = safeString(stringVal);

  return safeType(prevSubject, '{selectall}{del}' + outString);
}