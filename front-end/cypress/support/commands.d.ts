/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable<Subject = any> {
      safeType(value: string | number): Chainable<JQuery<HTMLElement>>;
      overwrite(value: string | number): Chainable<JQuery<HTMLElement>>;
      loginAs(role?: "owner" | "admin" | "regular"): Chainable<void>;
      openUsersPage(): Chainable<void>;
      loginWithEnv(): Chainable<void>;
    }
  }
}
export {};

