/// <reference types="cypress" />

// Declare types so TS knows about the custom commands on `cy.get(...).safeType(...)`
declare global {
  namespace Cypress {
    interface Chainable<Subject = any> {
      /** Chainable: types into an element safely (focus/click first). */
      safeType(
        value: string | number,
        options?: Partial<Cypress.TypeOptions>
      ): Chainable<Subject>;

      /** Chainable: clears existing text (via select-all+del) then types. */
      overwrite(value: string | number): Chainable<Subject>;

      /** Your existing helper to navigate to Users page. */
      openUsersPage(): Chainable<void>;
    }
  }
}
export {}; // ensure this file is a module for TS augmentation

// ───────────────────────────────────────────────────────────────────────────────
// openUsersPage 
// ───────────────────────────────────────────────────────────────────────────────
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

// ───────────────────────────────────────────────────────────────────────────────
// string utils
// ───────────────────────────────────────────────────────────────────────────────
export function safeString(stringVal: string | number | undefined | null): string {
  if (stringVal === null || stringVal === undefined) return "";
  return String(stringVal);
}

// ───────────────────────────────────────────────────────────────────────────────
// REGISTER chainable commands
// ───────────────────────────────────────────────────────────────────────────────

Cypress.Commands.add(
  "safeType",
  { prevSubject: "element" },
  (subject, value: string | number, options: Partial<Cypress.TypeOptions> = {}) => {
    const out = safeString(value);
    // If you pass empty/undefined, do nothing and keep the chain alive
    if (!out.length) return cy.wrap(subject);

    // Be a little resilient: ensure focus/click first (helps with masked inputs)
    return cy
      .wrap(subject)
      .should("exist")
      .click({ force: true })
      .type(out, { delay: 0, ...options });
  }
);

Cypress.Commands.add(
  "overwrite",
  { prevSubject: "element" },
  (subject, value: string | number) => {
    const out = safeString(value);
    // Use select-all + delete to clear, then type new value
    return cy
      .wrap(subject)
      .should("exist")
      .click({ force: true })
      .type("{selectall}{del}", { delay: 0 })
      .type(out, { delay: 0 });
  }
);
