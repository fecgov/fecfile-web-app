// --- Manage Users helpers ---
// Types for new commands
// import type { Chainable } from 'cypress';
// Use the global Cypress namespace for type declarations below.

declare global {
  namespace Cypress {
    interface Chainable {
      loginAs(role?: 'owner' | 'regular'): Chainable<void>;
      openUsersPage(): Chainable<void>;
      safeType(value: string | number | null | undefined): Chainable<Subject>;
    }
  }
}



Cypress.Commands.add('openUsersPage', () => {
// Open account menu → Users
cy.findByRole('button', { name: /account|profile|menu|user/i }).click({ force: true });
cy.findByRole('menuitem', { name: /users/i }).click({ force: true });
});




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