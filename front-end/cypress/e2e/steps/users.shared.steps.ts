/// <reference types="cypress" />
/// <reference types="@badeball/cypress-cucumber-preprocessor" />
/// <reference types="@testing-library/cypress" />

import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

// --- Robust page-object import (supports default export, named class, or instance) ---
import { Initialize } from '../pages/loginPage';

// -------------------- Helpers --------------------

// Put this near the top of your users.shared.steps.ts (or a helpers file)
function aliasUsersTable() {
  // Grab the first real table or ARIA/table-ish component and alias it
  cy.get('table, [role="table"], .mat-table, [data-testid="users-table"]', { timeout: 15000 })
    .first()
    .as('table');
}

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getRowByEmail(email: string) {
  // Use string match to avoid TS overload issues
  return cy.get('@table')
    .contains('td,[role="cell"]', email, { matchCase: false })
    .parents('tr')
    .first();
}
function openAddUserDialog() {
  cy.findAllByRole("button", { name: /add\s*user|invite/i })
    .first()
    .click({ force: true });
  cy.findByRole("dialog").as("dialog");
}

function submitAddUser(email: string) {
  const finalEmail = email.replace("<timestamp>", `${Date.now()}`);
  cy.wrap({ value: finalEmail }, { log: false }).as("lastEmail");

  cy.get("@dialog").within(() => {
    cy.findAllByLabelText(/email( address)?/i).then(($inputs) => {
      if ($inputs.length) {
        cy.wrap($inputs.first()).clear().type(finalEmail);
      } else {
        cy.get('input[type="email"]').first().clear().type(finalEmail);
      }
    });

    cy.findAllByRole("button", { name: /add|invite|submit/i })
      .first()
      .click({ force: true });
  });
}

function confirmDeletion() {
  cy.findByRole("dialog").within(() => {
    cy.findAllByRole("button", { name: /yes|confirm|delete/i })
      .first()
      .click({ force: true });
  });
}

function openUsersPage() {
  cy.findByRole('button', { name: /account|profile|menu|user/i }).click({ force: true });
  cy.findByRole('menuitem', { name: /users/i }).click({ force: true });
}

// -------------------- Step Definitions --------------------

// Accepts BOTH:
//   Given I am logged in as an "owner"
//   Given I log in as an "owner"
Given(
  /^I (?:am logged in as|log in as) an? "([^"]+)"$/,
  (role: "owner" | "regular" | "admin") => {
    Initialize();
  }
);

Given("I am on the Users page", () => {
  cy.visit("/");
  /*
  // App nav: account/profile menu → Users
  cy.findByRole("button", { name: /account|profile|menu|user/i }).click({ force: true });
  cy.findByRole("menuitem", { name: /users/i }).click({ force: true });

  cy.url().should("match", /\/users\b/);
  aliasUsersTable();
  */
  openUsersPage();
});

Then("I should be on the Users route", () => {
  cy.url().should("match", /\/committee\/members\b/);
});

import type { DataTable } from "@badeball/cypress-cucumber-preprocessor";

Then("I should see the users table with columns:", (dataTable) => {
  // Always (re)alias to be safe
  aliasUsersTable();
  cy.get('@table').should('be.visible');

  // Normalize header text and tolerate Action/Actions + glyphs
  const normalize = (s: string) =>
    (s || "")
      .replace(/\s+/g, " ")
      .replace(/[▲▼▪•⋯·…:|/\\\-–—]+/g, " ")
      .trim()
      .toLowerCase();

  const expected = dataTable.raw().flat().filter(Boolean)
    .map((h: string) => normalize(h))
    .map((h) => (h === "action" ? "actions" : h)); // singular → plural

  cy.get('@table')
    .find('th,[role="columnheader"]', { timeout: 15000 })
    .then(($ths) => {
      const actual = Array.from($ths, el => normalize(el.textContent || ""))
        .map((h) => (h === "action" ? "actions" : h));

      cy.log(`Headers seen: ${actual.join(" | ")}`);
      expected.forEach((want) => {
        expect(
          actual.includes(want),
          `Expected column "${want}" in [${actual.join(", ")}]`
        ).to.equal(true);
      });
    });
});


Then("I should see at least one user row", () => {
  cy.get("@table").within(() => {
    cy.findAllByRole("row").its("length").should("be.gte", 2); // header + ≥1 row
  });
});

When("I open the Add User dialog", () => {
  openAddUserDialog();
});

When('I submit email {string}', (email: string) => {
  submitAddUser(email);
});

Then('I should see a success indicator or the user {string} appears in the list', (email: string) => {
  const expected = email.replace("<timestamp>", `${Date.now()}`);
  cy.get("body").then(($b) => {
    const text = $b.text() || "";
    if (/success|invited|added/i.test(text)) {
      expect(text).to.match(/success|invited|added/i);
    } else {
      aliasUsersTable();
      getRowByEmail(expected).should("exist");
    }
  });
});

Given('the user {string} exists in the table', (email: string) => {
  aliasUsersTable();
  getRowByEmail(email).should("exist");
});

When('I delete the user {string}', (email: string) => {
  // ensure table alias exists
  aliasUsersTable();

  // 1) find the row by email
  getRowByEmail(email).as('row');

  // 2) open the kebab menu (icon inside a button)
  cy.get('@row').within(() => {
    cy.get('span.pi.pi-ellipsis-v')
      .first()
      .parents('button')
      .first()
      .click({ force: true });
  });

  // 3) click the Delete button in the overlay menu
  cy.get('.cdk-overlay-container, .p-overlaypanel, .p-menu, body', { timeout: 10000 })
    .find('button.table-action-button, button.p-button, button')
    .filter(':visible')
    .filter((_, el) => /(^|\s)delete(\s|$)/i.test((el.textContent || '').trim()))
    .first()
    .click({ force: true })
    .then(undefined, () => {
      // Fallback if needed: stable id (if it remains consistent)
      cy.get('#button-1', { timeout: 3000 }).click({ force: true });
    });

  // 4) confirm dialog → Yes
  cy.get('.p-confirmdialog, .cdk-overlay-container, body', { timeout: 10000 })
    .find('.p-confirmdialog-accept-button, button')
    .filter(':visible')
    .filter((_, el) => /(^|\s)yes(\s|$)/i.test((el.textContent || '').trim()))
    .first()
    .click({ force: true });
});



Then('the user {string} should not appear in the list', (email: string) => {
  aliasUsersTable();
  cy.get('@table').should('be.visible');
  cy.get('@table')
  .contains('td,[role="cell"]', email, { matchCase: false })
  .should('not.exist');
});
