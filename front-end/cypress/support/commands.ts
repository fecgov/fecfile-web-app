/// <reference types="cypress" />

// ---- Type augmentation (what was in commands.d.ts) --------------------------
declare global {
  namespace Cypress {
    interface Chainable<Subject = any> {
      /** Types safely, skipping empty/null/undefined input */
      safeType(value: string | number): Chainable<JQuery<HTMLElement>>;
      /** Select-all + delete, then types safely */
      overwrite(value: string | number): Chainable<JQuery<HTMLElement>>;
      /** Your own auth helper that may exist elsewhere */
      loginAs(role?: "owner" | "admin" | "regular"): Chainable<void>;
      /** Opens Users page via the app's UI */
      openUsersPage(): Chainable<void>;
      /** Logs in using EMAIL/PASSWORD from Cypress env */
      loginWithEnv(): Chainable<void>;
    }
  }
}

// Make this file a module so global augmentation is applied.
export {}

// ---- Implementations (what was in commands.ts) ------------------------------
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

  cy.get(overlayRoot, { timeout: 10000 }).within(() => {
    // Case A: your element exactly as provided
    cy.contains("button.popover-button", "Users", { matchCase: false }).click({ force: true });
  });

  // 3) Confirm navigation
  cy.location("pathname", { timeout: 5000 }).should("match", /\/committee\/members\b/);
});

// ---- Helpers + command registrations for safeType/overwrite -----------------
function safeString(stringVal: string | number | undefined | null): string {
  if (stringVal === null || stringVal === undefined) return "";
  return String(stringVal);
}

/** Registers cy.safeType: no-op if the value is empty/null/undefined */
Cypress.Commands.add(
  "safeType",
  { prevSubject: "element" },
  (subject: JQuery<HTMLElement>, value: string | number) => {
    const out = safeString(value);
    const s = cy.wrap(subject);
    if (out.length) s.type(out);
    return s;
  }
);

/** Registers cy.overwrite: select-all + delete, then safeType */
Cypress.Commands.add(
  "overwrite",
  { prevSubject: "element" },
  (subject: JQuery<HTMLElement>, value: string | number) => {
    const out = safeString(value);
    const s = cy.wrap(subject).type("{selectall}{del}");
    if (out.length) s.type(out);
    return s;
  }
);
