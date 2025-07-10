import { Candidate_House_A, Committee_A, Individual_A_A, Organization_A } from '../requests/library/contacts';
import { makeRequestToAPI } from '../requests/methods';
import { F3X, F3X_Q2 } from '../requests/library/reports';

export interface Setup {
  organization?: boolean;
  individual?: boolean;
  candidate?: boolean;
  committee?: boolean;
  report?: F3X;
}

export async function F3XSetup(setup: Setup = {}) {
  // Initialize results object
  const results = {
    organization: null,
    individual: null,
    candidate: null,
    committee: null,
    report: null,
  };

  // Create an array of promises
  const apiCalls = [];

  // Collect API call Chainables based on setup
  if (setup.individual) {
    apiCalls.push(
      new Cypress.Promise((resolve) => {
        makeRequestToAPI('POST', 'http://localhost:8080/api/v1/contacts/', Individual_A_A, (response) => {
          results.individual = response.body;
          resolve();
        });
      }),
    );
  }

  if (setup.organization) {
    apiCalls.push(
      new Cypress.Promise((resolve) => {
        makeRequestToAPI('POST', 'http://localhost:8080/api/v1/contacts/', Organization_A, (response) => {
          results.organization = response.body;
          resolve();
        });
      }),
    );
  }

  if (setup.candidate) {
    apiCalls.push(
      new Cypress.Promise((resolve) => {
        makeRequestToAPI('POST', 'http://localhost:8080/api/v1/contacts/', Candidate_House_A, (response) => {
          results.candidate = response.body;
          resolve();
        });
      }),
    );
  }

  if (setup.committee) {
    apiCalls.push(
      new Cypress.Promise((resolve) => {
        makeRequestToAPI('POST', 'http://localhost:8080/api/v1/contacts/', Committee_A, (response) => {
          results.committee = response.body;
          resolve();
        });
      }),
    );
  }

  apiCalls.push(
    new Cypress.Promise((resolve) => {
      makeRequestToAPI(
        'POST',
        'http://localhost:8080/api/v1/reports/form-3x/?fields_to_validate=filing_frequency',
        setup.report ?? F3X_Q2,
        (response) => {
          results.report = response.body.id;
          resolve();
        },
      );
    }),
  );

  // Combine all the Chainables and return them
  await Cypress.Promise.all(apiCalls);
  return results;
}
