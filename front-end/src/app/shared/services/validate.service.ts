import { Injectable } from '@angular/core';
import { validate, ValidationError } from 'fecfile-validate';
import { schema as f3xSchema } from 'fecfile-validate/fecfile_validate_js/dist/F3X';

@Injectable({
  providedIn: 'root',
})
export class ValidateService {
  constructor() {}

  validate(): ValidationError[] {
    const data = {
      form_type: '',
      filer_committee_id_number: 'C00123456',
      committee_name: 'Foes of Chris',
      change_of_address: false,
      street_1: '123 main street',
      street_2: '',
      city: 'Best Town',
      state: 'DC^^',
      zip: '20000',
      report_code: '',
      election_code: '',
      date_of_election: '20021101',
      state_of_election: 'DC',
      coverage_from_date: '20000101',
      coverage_through_date: '20000201',
      qualified_committee: true,
      treasurer_last_name: 'Doe',
      treasurer_first_name: 'J',
      treasurer_middle_name: 'X',
      treasurer_prefix: 'Dr',
      treasurer_suffix: 'PhD',
      date_signed: '20040729',
      L6b_cash_on_hand_beginning_period: 1,
    };

    const errors: ValidationError[] = validate(f3xSchema, data);
    console.log(errors);
    return errors;
  }
}
