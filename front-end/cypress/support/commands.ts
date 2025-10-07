Cypress.Commands.add("openUsersPage", () => {
  // 1) Open the popout / account menu (try a few common triggers)
  const openMenu = () => {
    // Try any of these buttons that open the popover/menu
    cy.findAllByRole("button", { name: /account|profile|menu|user|settings|more/i })
      .first()
      .click({ force: true });
  };

  openMenu();

  // 2) Click "Users" from the popover/menu
  // Prefer overlay container (Angular CDK) if present, then fall back to document
  const overlayRoot = ".cdk-overlay-container, .overlay-container, body";

  cy.get(overlayRoot, { timeout: 10000 })
    .within(() => {
      // Case A: your element exactly as provided
      cy.contains("button.popover-button", "Users", { matchCase: false })
        .click({ force: true });
    });

  // 3) Confirm navigation
  cy.location("pathname", { timeout: 5000 }).should("match", /\/committee\/members\b/);
}); 



export function safeString(stringVal: string | number | undefined | null): string {
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