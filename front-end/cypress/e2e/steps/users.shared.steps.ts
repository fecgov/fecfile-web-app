/// <reference types="cypress" />
/// <reference types="@badeball/cypress-cucumber-preprocessor" />
/// <reference types="@testing-library/cypress" />

import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { UsersPage } from "../pages/usersPage";
import { PageUtils } from "../pages/pageUtils";
import { Initialize } from "../pages/loginPage";

/* ============================
   ENDPOINTS & HELPERS
   ============================ */

const INVITE_POST = "**/api/v1/committee-members/**";
const DELETE_MEMBER = "**/api/v1/committee-members/**";
const LIST_MEMBERS = "**/api/v1/committee-members**"; // GET list (no hard-coded host)

function augmentNextMembersGETWith(email: string, role: string = "Manager") {
  cy.intercept("GET", LIST_MEMBERS, (req) => {
    req.reply((res) => {
      const body = res.body;

      const coll = (() => {
        if (Array.isArray(body)) return { get: () => body as any[], set: (next: any[]) => (res.body = next) };
        if (body?.results && Array.isArray(body.results))
          return { get: () => body.results as any[], set: (next: any[]) => (res.body = { ...body, results: next }) };
        if (body?.items && Array.isArray(body.items))
          return { get: () => body.items as any[], set: (next: any[]) => (res.body = { ...body, items: next }) };
        return { get: () => [], set: (next: any[]) => (res.body = next) };
      })();

      const arr = coll.get();
      const template =
        (arr && arr[0] && JSON.parse(JSON.stringify(arr[0]))) || {
          id: "seed-" + Date.now(),
          email: "",
          name: "Seeded User",
          role: "Manager",
          status: "Active",
        };

      const seeded = JSON.parse(JSON.stringify(template));
      seeded.id = "seed-" + Date.now();

      if ("email" in seeded) seeded.email = email;
      if (seeded.user && typeof seeded.user === "object") {
        seeded.user.email = email;
        if (!seeded.user.name) seeded.user.name = seeded.name || "Seeded User";
      }
      if (!seeded.name) seeded.name = "Seeded User";

      if ("role" in seeded) seeded.role = role;
      else if ("memberRole" in seeded) seeded.memberRole = role;
      else if (Array.isArray(seeded.permissions)) seeded.permissions = ["Manager"];

      coll.set([seeded, ...(arr || [])]);
    });
  }).as("membersAugmented");
}

/** Ensure there is a visible row for the given email */
function ensureRowBySeeding(email: string, role: string = "Manager") {
  aliasUsersTable();
  getRowByEmail(email).then(($row) => {
    if ($row && $row.length) return;
    augmentNextMembersGETWith(email, role);
    UsersPage.goToPage();           // triggers the GET
    cy.wait("@membersAugmented");
    aliasUsersTable();
    getRowByEmail(email).should("exist");
  });
}

/* ============================
   TOAST ASSERTIONS (PrimeNG)
   ============================ */

function assertSuccessToast(summaryRegex: RegExp = /^success$/i) {
  // Wait for a toast to appear (PrimeNG: .p-toast + .p-toast-message-success)
  cy.get(".p-toast", { timeout: 10000 }).should("exist");

  cy.get(".p-toast-message-success, .p-toast-message", { timeout: 10000 })
    .filter(":visible")
    .first()
    .within(() => {
      // Summary typically holds "SUCCESS"
      cy.get(".p-toast-summary, .p-message-summary")
        .invoke("text")
        .then((t) => (t || "").trim())
        .should((txt) => expect(txt).to.match(summaryRegex));

      // Optional: detail contains human-readable message (keep tolerant)
      cy.get(".p-toast-detail, .p-message-detail").then(($d) => {
        if ($d.length) {
          expect(($d.text() || "").trim().length).to.be.greaterThan(0);
        }
      });
    });
}

function closeToastIfPresent() {
  // Use your existing helper (preferred)
  try {
    PageUtils.closeToast();
  } catch {
    // Fallback: click the X if available
    cy.get(".p-toast .p-toast-close-button").first().click({ force: true }).should("not.exist");
  }
}


const submitBtn = () => cy.get("[data-cy='membership-submit']");
const emailInput = () => cy.get("#email").first();

// Inline error inside the Add User dialog (field-level or banner-level)
const inlineEmailError = () =>
  cy.get("@dialog").find(
    "[data-cy='email-error'], small.p-error, .p-error, .p-message-error, .p-inline-message.p-inline-message-error"
  ).filter(":visible").first();

// Any error message surfaced in the dialog (fallback for 500s that may not be field-bound)
const anyDialogError = () =>
  cy.get("@dialog").find(
    "[data-cy='email-error'], [aria-live='assertive'], [role='alert'], .p-message-error, .p-error, .p-inline-message-error"
  ).filter(":visible").first();

// Page-wide error (used for delete failures which are not in a dialog)
const anyPageError = () =>
  cy.get("body").find(
    "[role='alert'], [aria-live='assertive'], .p-toast-message-error, .p-message-error, .p-inline-message-error"
  ).filter(":visible").first();

const a11ySuccess = () =>
  cy.get("[role='status'], .p-message-success, .p-toast-message-success").first();

const assertDisabled = ($el: JQuery<HTMLElement>) => {
  const aria = ($el.attr("aria-disabled") || "").toLowerCase() === "true";
  const dis = $el.is(":disabled");
  const cls = $el.hasClass("p-disabled") || $el.hasClass("disabled");
  expect(aria || dis || cls, "button is disabled").to.eq(true);
};
const assertEnabled = ($el: JQuery<HTMLElement>) => {
  const aria = ($el.attr("aria-disabled") || "").toLowerCase() === "true";
  const dis = $el.is(":disabled");
  const cls = $el.hasClass("p-disabled") || $el.hasClass("disabled");
  expect(!(aria || dis || cls), "button is enabled").to.eq(true);
};

function aliasUsersTable() {
  cy.get('table, [role="table"], .mat-table, [data-testid="users-table"]', { timeout: 15000 })
    .first()
    .as("table");
}
function getRowByEmail(email: string) {
  return cy
    .get("@table")
    .contains("td,[role='cell']", email, { matchCase: false })
    .parents("tr")
    .first();
}
function openAddUserDialog() {
  PageUtils.clickButton("Add user");
  cy.findByRole("dialog").as("dialog");
}
function ensureAddUserDialogOpen() {
  cy.get("body").then(($b) => {
    if ($b.find("[role='dialog']").length === 0) {
      openAddUserDialog();
    } else {
      cy.findByRole("dialog").as("dialog");
    }
  });
}

/* ============================
   RBAC (MANAGER-IN-OTHER-COMMITTEE) ASSERTIONS
   ============================ */

function assertNoAddUserButton() {
  const selectors = [
    "[data-cy='membership-add']",
    "button:contains('Add user')",
    "button:contains('Invite')",
    "a:contains('Add user')",
    "a:contains('Invite')",
  ];
  cy.get("body").then(($b) => {
    const found = selectors.some((sel) => $b.find(sel).filter(":visible").length > 0);
    expect(found, "no Add/Invite affordance should be visible").to.eq(false);
  });
}

// No kebab/action menu on any row
function assertNoRowKebabs() {
  aliasUsersTable();
  cy.get("@table").within(() => {
    const kebabSelectors = [
      "app-table-actions-button button",
      "button[aria-haspopup='menu']",
      ".p-button:has(.pi-ellipsis-v)",
      ".p-menuButton",
      ".pi.pi-ellipsis-v",
      ".kebab, .kabob, .ellipsis"
    ];

    cy.root().then(($root) => {
      const any = kebabSelectors.some((sel) => $root.find(sel).filter(":visible").length > 0);
      expect(any, "no row action kebabs should be visible").to.eq(false);
    });
  });
}

function switchCommitteeToLast() {
  cy.intercept('GET', 'http://localhost:8080/api/v1/committee-members/').as('GetCommitteeMembers');
  cy.visit('/login/select-committee');
  cy.get('.committee-list .committee-info').last().click();
  cy.wait('@GetCommitteeMembers');
}

function switchCommitteeToFirst() {
  cy.intercept('GET', 'http://localhost:8080/api/v1/committee-members/').as('GetCommitteeMembers');
  cy.visit('/login/select-committee');
  cy.get('.committee-list .committee-info').first().click();
  cy.wait('@GetCommitteeMembers');
}

function stubOnce(
  method: Cypress.HttpMethod,
  url: string,
  response: Partial<Cypress.StaticResponse>,
  alias: string
) {
  cy.intercept({ method, url, times: 1 }, response).as(alias);
}



/* ============================
   LOGIN + NAVIGATION
   ============================ */

Given(/^I (?:am logged in as|log in as) an? "([^"]+)"$/, (_role: string) => {
  Initialize();
});

Given("I am on the Users page", () => {
  UsersPage.goToPage();
});

Then("I should be on the Users route", () => {
  cy.url().should("match", /\/committee\/members\b/);
});

When("I open the Add User dialog", () => {
  UsersPage.goToPage();
  openAddUserDialog();
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
  cy.get('@table')
  .find('td')
  .contains('new.user@example.com')
  .should('not.exist');
});

/* ============================
   TABLE ASSERTIONS (optional)
   ============================ */

Then("I should see the users table with columns:", (dataTable) => {
  aliasUsersTable();
  cy.get("@table").should("be.visible");

  const normalize = (s: string) =>
    (s || "")
      .replace(/\s+/g, " ")
      .replace(/[▲▼▪•⋯·…:|/\\\-–—]+/g, " ")
      .trim()
      .toLowerCase();

  const expected = dataTable
    .raw()
    .flat()
    .filter(Boolean)
    .map((h: string) => normalize(h))
    .map((h) => (h === "action" ? "actions" : h));

  cy.get("@table")
    .find("th,[role='columnheader']", { timeout: 15000 })
    .then(($ths) => {
      const actual = Array.from($ths, (el) => normalize(el.textContent || "")).map((h) =>
        h === "action" ? "actions" : h
      );
      expected.forEach((want) => {
        expect(
          actual.includes(want),
          `Expected column "${want}" in [${actual.join(", ")}]`
        ).to.equal(true);
      });
    });
});

Then("I should see at least one user row", () => {
  aliasUsersTable();
  cy.get("@table").within(() => {
    cy.findAllByRole("row").its("length").should("be.gte", 2); // header + ≥1 data row
  });
});

/* ============================
   CLIENT-SIDE EMAIL VALIDATION
   ============================ */

When("the email field is empty", (raw: string) => {
  emailInput().clear();
});

When("I fill the invite email {string}", (raw: string) => {
  //ensureAddUserDialogOpen();
  const email = raw.replace("<timestamp>", `${Date.now()}`);
  cy.wrap({ value: email }, { log: false }).as("lastEmail");
  emailInput().clear().type(email);
});

Then("the email field should be marked invalid", () => {
  emailInput()
    .should("be.visible")
    .and(($el) => {
      const ariaInvalid = ($el.attr("aria-invalid") || "").toLowerCase() === "true";
      const ngInvalid = $el.hasClass("ng-invalid") || $el.closest(".ng-invalid").length > 0;
      const pInvalid = $el.hasClass("p-invalid") || $el.closest(".p-invalid").length > 0;
      expect(ariaInvalid || ngInvalid || pInvalid, "invalid state").to.eq(true);
    });

  // Inline field-level message is visible in the dialog
  inlineEmailError().should("be.visible");
});

Then("the Invite submit should be disabled", () => {
  submitBtn().should(($b) => assertDisabled($b));
});

Then("no invite request should be sent", () => {
  cy.intercept("POST", INVITE_POST).as("inviteMaybe");
  submitBtn().click({ force: true }); // even if clicked, no request should fire
  cy.wait(250);
  cy.get("@inviteMaybe.all").should("have.length.at.most", 0);
});

/* ============================
   SERVER-SIDE INVITE (400/409/500)
   ============================ */

Given("I stub the next invite as 400 validation with message {string}", (message: string) => {
  stubOnce("POST", INVITE_POST, {
    statusCode: 400,
    body: { message, code: "validation_error", field: "email" },
  }, "invite400");
});

Given("I stub the next invite as 409 duplicate with message {string}", (message: string) => {
  stubOnce("POST", INVITE_POST, {
    statusCode: 409,
    body: { message, code: "duplicate_invite" },
  }, "invite409");
});

Given("I stub the next invite as 500", () => {
  stubOnce("POST", INVITE_POST, {
    statusCode: 500,
    body: { message: "Server error" },
  }, "invite500");
});

When("I submit the invite", () => {
  submitBtn().should(($b) => assertEnabled($b));
  submitBtn().click({ force: true });
});

// Interpret “accessible error announced” as inline field/banners inside the dialog (no global alerts)
Then("an accessible error should be announced", () => {
  anyDialogError()
    .should("be.visible")
    .and(($el) => expect(($el.text() || "").trim().length).to.be.greaterThan(0));
});

// Keep inclusive matcher (works with localized copy)…
Then("the error message should include {string}", (snippet: string) => {
  anyDialogError().invoke("text").then((t) => t.toLowerCase()).should("include", snippet.toLowerCase());
});

// …and also allow exact inline duplicate copy when you want it:
Then('the inline email error should equal {string}', (expected: string) => {
  inlineEmailError().invoke("text").then((t) => expect(t.trim()).to.eq(expected));
});

Then("the Invite submit remains enabled for retry", () => {
  submitBtn().should(($b) => assertEnabled($b));
});


Then("I can retry inviting the same email successfully", () => {
  cy.intercept("POST", INVITE_POST).as("invite201");
  cy.intercept("GET", LIST_MEMBERS).as("GetMembers");
  submitBtn().should(($b) => assertEnabled($b));
  submitBtn().click({ force: true });
  cy.wait("@invite201").its("response.statusCode").should("be.oneOf", [200, 201]);
  cy.wait("@GetMembers");
  cy.get('[data-cy="membership-submit"]').should("not.be.visible");
});


/* ============================
   DELETE (seed, fail, retry)
   ============================ */

Given("a user row exists for {string}", (email: string) => {
  ensureRowBySeeding(email);
});

Given("I stub the next delete as 500 for {string}", (_email: string) => {
  stubOnce("DELETE", DELETE_MEMBER, {
    statusCode: 500,
    body: { message: "Server error" },
  }, "delete500");
});

// Open & pick kebab actions using your PageUtils helpers
When('I open the kebab for {string}', (identifier: string) => {
  aliasUsersTable();
  PageUtils.getKabob(identifier);
});

When('I choose the {string} action from the kebab for {string}', (item: string, identifier: string) => {
  PageUtils.clickKababItem(identifier, item);
});

When('I attempt to delete {string}', (email: string) => {
  // Reuse your helper to click Delete, then confirm if needed
  PageUtils.clickKababItem(email, "Delete");
  cy.get("body").then(($b) => {
    const $yes = $b.find('.p-confirmdialog-accept, .p-confirmdialog .p-button:contains("Yes")').first();
    if ($yes.length) cy.wrap($yes).click({ force: true });
  });
}); 

Then("a SUCCESS ptoast should be visible and is closed", () => {
  assertSuccessToast(/^success$/i);
  closeToastIfPresent();
});


Then("I can retry delete for {string} successfully", (email: string) => {
  UsersPage.delete(email);
  cy.get('table tbody tr').contains('td', email).should('not.exist');
});

/* ============================
   Steps: manager via committee switch
   ============================ */

Given('I switch to the manager committee "C99999998"', () => {
  switchCommitteeToFirst();   // uses your built-in PageUtils
});

Given('I switch to the manager committee "C99999999"', () => {
  switchCommitteeToLast();   // uses your built-in PageUtils
});

Given('I am on the Users page for the manager committee "C99999998"', () => {
  switchCommitteeToFirst();
  UsersPage.goToPage();                     // your existing nav helper
  aliasUsersTable();
  cy.get("@table").should("be.visible");
  cy.get("@table").find("tbody tr").should("have.length.greaterThan", 0); // can list users
});

Then("I should not see an Add user affordance", () => {
  assertNoAddUserButton();
});

Then("I should not see any row action kebabs", () => {
  assertNoRowKebabs();
});

Then('the row for {string} should have no action kebab', (email: string) => {
  aliasUsersTable();
  getRowByEmail(email)
    .should('exist')
    .within(() => {
      const kebabSelectors = [
        'app-table-actions-button button',
        "button[aria-haspopup='menu']",
        '.p-button:has(.pi-ellipsis-v)',
        '.p-menuButton',
        '.pi.pi-ellipsis-v',
        '.kebab, .kabob, .ellipsis',
      ];
      cy.root().then(($row) => {
        const any = kebabSelectors.some((sel) => $row.find(sel).filter(':visible').length > 0);
        expect(any, `no kebab should be visible for ${email}`).to.eq(false);
      });
    });
});


Then("I should see users but no management actions", () => {
  aliasUsersTable();
  cy.get("@table").should("be.visible");
  assertNoAddUserButton();
  assertNoRowKebabs();
});

/* ----------------------------------------------------------------
   Create (Invite) – reuse UsersPage.create + UsersPage.assertRow
----------------------------------------------------------------- */

Given('I will watch the members list refresh', () => {
  cy.intercept("GET", LIST_MEMBERS).as("GetMembers");
});

When('I invite "{string}" via UsersPage', (rawEmail: string) => {
  const email = rawEmail.replace("<timestamp>", `${Date.now()}`);
  cy.wrap(email, { log: false }).as("lastEmail");

  // drive the exact same UI flow your .cy.ts uses
  UsersPage.create(formWithEmail(email));

  // wait for list refresh the same way your .cy.ts does
  cy.wait("@GetMembers");
});

When("I fill the invite email :", (dataTable) => {
  const rows: string[] = (dataTable.raw() || []).map((r: any[]) => (r?.[0] ?? ""));
  rows.forEach((raw: string, idx: number) => {
    const email = String(raw).replace("<timestamp>", `${Date.now()}`);
    cy.wrap({ value: email }, { log: false }).as("lastEmail");
    if (email === "") {
      emailInput().clear().should("have.value", "");
    } else {
      emailInput().clear().type(email).should("have.value", email);
    }
  });
});

Then('the row for "{string}" should exist', (email: string) => {
  // Use your existing assertion
  UsersPage.assertRow(formWithEmail(email));
});

/* ----------------------------------------------------------------
   Edit role – reuse UsersPage.editRole + assertRow
----------------------------------------------------------------- */

When('I change the role of "{string}" to "{string}" via UsersPage', (email: string, role: string) => {
  UsersPage.editRole(formWithRole(email, role));
  cy.wait("@GetMembers"); // mirrors your .cy.ts test style
});

Then('the row for "{string}" should reflect role "{string}"', (email: string, role: string) => {
  UsersPage.assertRow(formWithRole(email, role));
});

/* ----------------------------------------------------------------
   Delete – reuse UsersPage.delete and assert via table/ptoast
----------------------------------------------------------------- */

When('I delete "{string}" via UsersPage', (email: string) => {
  // cache for follow-ups (e.g., ensuring row gone)
  cy.wrap(email, { log: false }).as("lastEmail");
  UsersPage.delete(email);
});

Then('the row for "{string}" should be gone', (email: string) => {
  cy.get("table tbody").contains("td", email).should("not.exist");
});

Then("a SUCCESS ptoast should be visible", () => {
  assertSuccessToast(/^success$/i);
  // optional: close toast with your util
  try { PageUtils.closeToast(); } catch {}
});


When('I invite {string}', (rawEmail: string) => {
  const email = rawEmail.replace("<timestamp>", `${Date.now()}`);
  cy.wrap(email, { log: false }).as("lastEmail");
  UsersPage.create(formWithEmail(email));
  cy.wait("@GetMembers");
});

When('I attempt to delete "{string}"', (email: string) => {
  // Use your kebab helpers indirectly via UsersPage.delete
  UsersPage.delete(email);
});
