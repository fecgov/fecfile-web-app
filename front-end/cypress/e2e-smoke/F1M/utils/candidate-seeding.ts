import { ContactFormData } from '../../models/ContactFormModel';
import {
  Candidate_House_A,
  Candidate_House_B,
  Candidate_Presidential_A,
  Candidate_Presidential_B,
  Candidate_Senate_A,
  MockContact,
} from '../../requests/library/contacts';
import { makeContact } from '../../requests/methods';

function createContactPromise(
  candidate: MockContact,
  candidates: ContactFormData[],
): Promise<void> {
  return new Cypress.Promise<void>((resolve) => {
    makeContact(candidate, (response) => {
      candidates.push(response.body);
      resolve();
    });
  });
}

export const qualifiedCandidates: MockContact[] = [
  Candidate_House_A,
  Candidate_House_B,
  Candidate_Presidential_A,
  Candidate_Presidential_B,
  Candidate_Senate_A,
];

export function seedQualifiedCandidates(): Cypress.Chainable<ContactFormData[]> {
  const candidates: ContactFormData[] = [];
  const apiCalls = qualifiedCandidates.map((candidate) => createContactPromise(candidate, candidates));

  return cy.then(() => Cypress.Promise.all(apiCalls)).then(() => {
    expect(candidates).to.have.lengthOf(qualifiedCandidates.length);
    return candidates;
  });
}

const romanMap: Record<number, string> = {
  1: 'I',
  2: 'II',
  3: 'III',
  4: 'IV',
  5: 'V',
};

export function getCandidateContributionDateFieldSelector(num: number): string {
  return `[data-cy="${romanMap[num + 1]}_date_of_contribution"]`;
}

