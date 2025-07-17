import { Individual_A_A, Organization_A, Candidate_House_A, Committee_A } from '../requests/library/contacts';
import { F24_24 } from '../requests/library/reports';
import { makeRequestToAPI } from '../requests/methods';

export interface Setup {
  organization?: boolean;
  individual?: boolean;
  candidate?: boolean;
  committee?: boolean;
}

export function F24Setup(setup: Setup = {}) {
  if (setup.individual) makeRequestToAPI('POST', 'http://localhost:8080/api/v1/contacts/', Individual_A_A);
  if (setup.organization) makeRequestToAPI('POST', 'http://localhost:8080/api/v1/contacts/', Organization_A);
  if (setup.candidate) makeRequestToAPI('POST', 'http://localhost:8080/api/v1/contacts/', Candidate_House_A);
  if (setup.committee) makeRequestToAPI('POST', 'http://localhost:8080/api/v1/contacts/', Committee_A);
  makeRequestToAPI(
    'POST',
    'http://localhost:8080/api/v1/reports/form-24/?fields_to_validate=report_type_24_48',
    F24_24,
  );
}
