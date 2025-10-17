import {
  Candidate_House_A,
  Candidate_Senate_A,
  Committee_A,
  Individual_A_A,
  Individual_B_B,
  MockContact,
  Organization_A,
} from '../requests/library/contacts';
import { makeContact, makeF24, makeF3x } from '../requests/methods';
import { F24_24, F3X, F3X_Q2 } from '../requests/library/reports';

export interface Setup {
  organization?: boolean;
  individual?: boolean;
  individual2?: boolean;
  candidate?: boolean;
  candidateSenate?: boolean;
  committee?: boolean;
  report?: F3X;
  reports?: F3X[];
  f24?: boolean;
}

type ConType = 'organization' | 'individual' | 'individual2' | 'candidate' | 'candidateSenate' | 'committee';

export interface Results {
  organization: any | null;
  individual: any | null;
  individual2: any | null;
  candidate: any | null;
  candidateSenate: any | null;
  committee: any | null;
  report: string;
  f24: string | null;
}

// Helper now returns a Cypress chainable
export function addContact(contact: MockContact, results: Results, property: ConType) {
  return makeContact(contact).then((response) => {
    results[property] = response.body;
  });
}

// Main DataSetup returns Chainable<Results> (not a Promise)
export function DataSetup(setup: Setup = {}): Cypress.Chainable<Results> {
  const results: Results = {
    organization: null,
    individual: null,
    individual2: null,
    candidate: null,
    candidateSenate: null,
    committee: null,
    report: '',
    f24: null,
  };

  // Start a Cypress chain
  let chain = cy.wrap(null, { log: false });

  if (setup.individual) {
    chain = chain.then(() => addContact(Individual_A_A, results, 'individual'));
  }
  if (setup.individual2) {
    chain = chain.then(() => addContact(Individual_B_B, results, 'individual2'));
  }
  if (setup.organization) {
    chain = chain.then(() => addContact(Organization_A, results, 'organization'));
  }
  if (setup.candidate) {
    chain = chain.then(() => addContact(Candidate_House_A, results, 'candidate'));
  }
  if (setup.candidateSenate) {
    chain = chain.then(() => addContact(Candidate_Senate_A, results, 'candidateSenate'));
  }
  if (setup.committee) {
    chain = chain.then(() => addContact(Committee_A, results, 'committee'));
  }

  if (setup.f24) {
    chain = chain
      .then(() => makeF24(F24_24))
      .then((response) => {
        results.f24 = response.body.id;
      });
  }

  if (setup.reports && setup.reports.length) {
    setup.reports.forEach((report, index) => {
      chain = chain
        .then(() => makeF3x(report))
        .then((response) => {
          if (index === 0) results.report = response.body.id;
        });
    });
  } else {
    const report = setup.report ?? F3X_Q2;
    chain = chain
      .then(() => makeF3x(report))
      .then((response) => {
        results.report = response.body.id;
      });
  }

  // Yield the aggregated results to callers
  return chain.then(() => results);
}
