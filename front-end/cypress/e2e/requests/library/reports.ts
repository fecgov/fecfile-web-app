import { currentYear } from '../../pages/pageUtils';

export interface F3X {
  report_type: string;
  form_type: string;
  report_code: string;
  coverage_from_date: string;
  coverage_through_date: string;
  state_of_election: string | null;
  date_of_election: string | null;
}

export const F3X_Q1: F3X = {
  report_type: 'F3X',
  form_type: 'F3XN',
  report_code: 'Q1',
  coverage_from_date: `${currentYear}-01-01`,
  coverage_through_date: `${currentYear}-03-31`,
  state_of_election: null,
  date_of_election: null,
};

export const F3X_Q2: F3X = {
  report_type: 'F3X',
  form_type: 'F3XN',
  report_code: 'Q2',
  coverage_from_date: `${currentYear}-04-01`,
  coverage_through_date: `${currentYear}-06-30`,
  state_of_election: null,
  date_of_election: null,
};

export const F3X_Q3: F3X = {
  report_type: 'F3X',
  form_type: 'F3XN',
  report_code: 'Q3',
  coverage_from_date: `${currentYear}-07-01`,
  coverage_through_date: `${currentYear}-09-30`,
  state_of_election: null,
  date_of_election: null,
};

export const F24_24 = {
  hasChangeOfAddress: false,
  submitAlertText:
    'Are you sure you want to submit this form electronically? Please note that you cannot undo this action. Any changes needed will need to be filed as an amended report.',
  can_delete: false,
  can_unamend: false,
  report_type: 'F24',
  form_type: 'F24N',
  name: '24-HOUR: Report of Independent Expenditure',
  report_type_24_48: '24',
  street_1: '1234 Street',
  city: 'Washington',
  state: 'DC',
  zip: '20001',
  filer_committee_id_number: 'C99999999',
  committee_name: 'Test Committee',
};
