import {
  Candidate_House_A,
  Candidate_Senate_A,
  Committee_A,
  Individual_A_A,
  Individual_B_B,
  Organization_A,
  withUniqueContactIdentifiers,
} from '../requests/library/contacts';
import type { MockContact } from '../requests/library/contacts';
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
  uniqueContactIds?: boolean;
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

function runIf(condition: boolean | undefined, fn: () => Cypress.Chainable<any>): Cypress.Chainable<any> {
  if (!condition) return cy.wrap(null, { log: false });
  return fn();
}

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
  const uniqueSeed = setup.uniqueContactIds
    ? `${Date.now()}-${Cypress._.random(1, 99999)}`
    : '';
  const contactForSetup = (contact: MockContact): MockContact =>
    setup.uniqueContactIds
      ? withUniqueContactIdentifiers(contact, uniqueSeed)
      : contact;

  const createReports = () => {
    if (setup.reports?.length) {
      let chain: Cypress.Chainable<any> = cy.wrap(null, { log: false });
      setup.reports.forEach((report, index) => {
        chain = chain.then(() =>
          makeF3x(report, (response) => {
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

  return cy
    .wrap(null, { log: false })
    .then(() =>
      runIf(setup.individual, () =>
        makeContact(contactForSetup(Individual_A_A), (response) => {
          results.individual = response.body;
        }),
      ),
    )
    .then(() =>
      runIf(setup.individual2, () =>
        makeContact(contactForSetup(Individual_B_B), (response) => {
          results.individual2 = response.body;
        }),
      ),
    )
    .then(() =>
      runIf(setup.organization, () =>
        makeContact(contactForSetup(Organization_A), (response) => {
          results.organization = response.body;
        }),
      ),
    )
    .then(() =>
      runIf(setup.candidate, () =>
        makeContact(contactForSetup(Candidate_House_A), (response) => {
          results.candidate = response.body;
        }),
      ),
    )
    .then(() =>
      runIf(setup.candidateSenate, () =>
        makeContact(contactForSetup(Candidate_Senate_A), (response) => {
          results.candidateSenate = response.body;
        }),
      ),
    )
    .then(() =>
      runIf(setup.committee, () =>
        makeContact(contactForSetup(Committee_A), (response) => {
          results.committee = response.body;
        }),
      ),
    )
    .then(() =>
      runIf(setup.f24, () =>
        makeF24(F24_24, (response) => {
          results.f24 = response.body.id;
        }),
      ),
    )
    .then(() => createReports())
    .then(() => {
      expect(results.report, 'created report id').to.not.equal('');
      return results;
    });
}
