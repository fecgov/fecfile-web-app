// cypress/support/commands.ts

// Type declarations
declare global {
  namespace Cypress {
    interface Chainable {
      overwrite(value: string | number | null | undefined): Chainable<Subject>;
      safeType(value: string | number | null | undefined): Chainable<Subject>;
    }
  }
}

// Helper function
function safeString(stringVal: string | number | undefined | null): string {
  if (stringVal === null || stringVal === undefined) {
    return '';
  } else {
    return stringVal.toString();
  }
}

// safeType command - types only if value is not empty
Cypress.Commands.add(
  'safeType',
  { prevSubject: 'element' },
  (subject: JQuery<HTMLElement>, value: string | number | null | undefined) => {
    const text = safeString(value);
    if (text.length) {
      cy.wrap(subject).type(text);
    }
    return cy.wrap(subject);
  }
);

// overwrite command - clears existing text and types new value
Cypress.Commands.add(
  'overwrite',
  { prevSubject: 'element' },
  (subject: JQuery<HTMLElement>, value: string | number | null | undefined) => {
    const text = safeString(value);
    
    if (text.length) {
      // Select all and delete, then type new value
      cy.wrap(subject).type('{selectall}{del}' + text);
    } else {
      // If empty string, just clear the field
      cy.wrap(subject).clear();
    }
    
    return cy.wrap(subject);
  }
);

