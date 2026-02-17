import {
  Candidate_House_A,
  Candidate_Senate_A,
  Committee_A,
  Individual_A_A,
  Individual_B_B,
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

interface Results {
  organization: any;
  individual: any;
  individual2: any;
  candidate: any;
  candidateSenate: any;
  committee: any;
  report: string;
  f24: string | null;
}

export function DataSetup(setup: Setup = {}): Cypress.Chainable<Results> { // NOSONAR: Cypress setup flow intentionally composes chained conditional callbacks
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

  const createReports = () => { // NOSONAR: Cypress setup flow intentionally composes chained conditional callbacks
    if (setup.reports?.length) {
      let chain: Cypress.Chainable<any> = cy.wrap(null, { log: false });
      setup.reports.forEach((report, index) => { // NOSONAR: Cypress setup flow intentionally composes chained conditional callbacks
        chain = chain.then(() => 
          makeF3x(report, (response) => { // NOSONAR: Cypress setup flow intentionally composes chained conditional callbacks
            if (index === 0) results.report = response.body.id;
          }),
        );
      });
      return chain;
    }

    return makeF3x(setup.report ?? F3X_Q2, (response) => {
      results.report = response.body.id;
    });
  };

  let chain: Cypress.Chainable<any> = cy.wrap(null, { log: false });

  if (setup.individual) {
    chain = chain.then(() =>
      makeContact(Individual_A_A, (response) => {
        results.individual = response.body;
      }),
    );
  }

  if (setup.individual2) {
    chain = chain.then(() =>
      makeContact(Individual_B_B, (response) => {
        results.individual2 = response.body;
      }),
    );
  }

  if (setup.organization) {
    chain = chain.then(() =>
      makeContact(Organization_A, (response) => {
        results.organization = response.body;
      }),
    );
  }

  if (setup.candidate) {
    chain = chain.then(() =>
      makeContact(Candidate_House_A, (response) => {
        results.candidate = response.body;
      }),
    );
  }

  if (setup.candidateSenate) {
    chain = chain.then(() =>
      makeContact(Candidate_Senate_A, (response) => {
        results.candidateSenate = response.body;
      }),
    );
  }

  if (setup.committee) {
    chain = chain.then(() =>
      makeContact(Committee_A, (response) => {
        results.committee = response.body;
      }),
    );
  }

  if (setup.f24) {
    chain = chain.then(() =>
      makeF24(F24_24, (response) => {
        results.f24 = response.body.id;
      }),
    );
  }

  return chain
    .then(() => createReports())
    .then(() => {
      expect(results.report, 'created report id').to.not.equal('');
      return results;
    });
}
