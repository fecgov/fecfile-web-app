import { Individual_A_A, Organization_A, Candidate_House_A, Committee_A } from '../requests/library/contacts';
import { F24_24 } from '../requests/library/reports';
import { makeContact, makeF24 } from '../requests/methods';

export interface Setup {
  organization?: boolean;
  individual?: boolean;
  candidate?: boolean;
  committee?: boolean;
}

export function F24Setup(setup: Setup = {}) {
  if (setup.individual) makeContact(Individual_A_A);
  if (setup.organization) makeContact(Organization_A);
  if (setup.candidate) makeContact(Candidate_House_A);
  if (setup.committee) makeContact(Committee_A);
  makeF24(F24_24);
}
