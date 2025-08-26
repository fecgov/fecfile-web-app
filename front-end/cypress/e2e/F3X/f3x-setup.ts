import {
  Candidate_House_A,
  Candidate_Senate_A,
  Committee_A,
  Individual_A_A,
  Individual_B_B,
  MockContact,
  Organization_A,
} from '../requests/library/contacts';
import { makeContact, makeF3x } from '../requests/methods';
import { F3X, F3X_Q2 } from '../requests/library/reports';

export interface Setup {
  organization?: boolean;
  individual?: boolean;
  individual2?: boolean;
  candidate?: boolean;
  candidateSenate?: boolean;
  committee?: boolean;
  report?: F3X;
  reports?: F3X[];
}

type ConType = 'organization' | 'individual' | 'individual2' | 'candidate' | 'candidateSenate' | 'committee';
function addContact(contact: MockContact, results: F3xResults, property: ConType) {
  return new Cypress.Promise((resolve) => {
    makeContact(contact, (response) => {
      results[property] = response.body;
      resolve();
    });
  });
}

export interface F3xResults {
  organization: any | null;
  individual: any | null;
  individual2: any | null;
  candidate: any | null;
  candidateSenate: any | null;
  committee: any | null;
  report: string;
}

export async function F3XSetup(setup: Setup = {}) {
  // Initialize results object
  const results: F3xResults = {
    organization: null,
    individual: null,
    individual2: null,
    candidate: null,
    candidateSenate: null,
    committee: null,
    report: '',
  };

  // Create an array of promises
  const apiCalls = [];

  // Collect API call Chainables based on setup
  if (setup.individual) {
    apiCalls.push(addContact(Individual_A_A, results, 'individual'));
  }

  if (setup.individual2) {
    apiCalls.push(addContact(Individual_B_B, results, 'individual2'));
  }

  if (setup.organization) {
    apiCalls.push(addContact(Organization_A, results, 'organization'));
  }

  if (setup.candidate) {
    apiCalls.push(addContact(Candidate_House_A, results, 'candidate'));
  }

  if (setup.candidateSenate) {
    apiCalls.push(addContact(Candidate_Senate_A, results, 'candidateSenate'));
  }

  if (setup.committee) {
    apiCalls.push(addContact(Committee_A, results, 'committee'));
  }

  if (setup.reports) {
    setup.reports.forEach((report, index) => {
      apiCalls.push(
        new Cypress.Promise((resolve) => {
          makeF3x(report, (response) => {
            if (index === 0) results.report = response.body.id;
            resolve();
          });
        }),
      );
    });
  } else {
    apiCalls.push(
      new Cypress.Promise((resolve) => {
        makeF3x(setup.report ?? F3X_Q2, (response) => {
          results.report = response.body.id;
          resolve();
        });
      }),
    );
  }

  // Combine all the Chainables and return them
  await Cypress.Promise.all(apiCalls);
  return results;
}
