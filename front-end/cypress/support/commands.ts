

import { LoginPage } from "../e2e/pages/loginPage";
const loginPage = new LoginPage();

/** Log in using EMAIL/PASSWORD from Cypress env (backed by CYPRESS_EMAIL/PASSWORD) */
Cypress.Commands.add("loginWithEnv", () => {
  const email = Cypress.env("EMAIL") as string;
  const password = Cypress.env("PASSWORD") as string;

  if (!email || !password) {
    throw new Error(
      "Missing creds. Set CYPRESS_EMAIL and CYPRESS_PASSWORD in your shell (Cypress exposes them as EMAIL/PASSWORD)."
    );
  }

  // simplest: no session caching, just log in
  loginPage.login(email, password);
});

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

