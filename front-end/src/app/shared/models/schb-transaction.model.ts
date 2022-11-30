import { plainToClass, Transform } from 'class-transformer';
import { Transaction } from './transaction.model';
import { LabelList } from '../utils/label.utils';
import { BaseModel } from './base.model';

export class SchBTransaction extends Transaction {
  back_reference_tran_id_number: string | undefined;
  back_reference_sched_name: string | undefined;
  entity_type: string | undefined;
  payee_organization_name: string | undefined;
  payee_last_name: string | undefined;
  payee_first_name: string | undefined;
  payee_middle_name: string | undefined;
  payee_prefix: string | undefined;
  payee_suffix: string | undefined;
  payee_street_1: string | undefined;
  payee_street_2: string | undefined;
  payee_city: string | undefined;
  payee_state: string | undefined;
  payee_zip: string | undefined;
  election_code: string | undefined;
  election_other_description: string | undefined;
  @Transform(BaseModel.dateTransform) expenditure_date: Date | undefined;
  expenditure_amount: number | undefined;
  semi_annual_refunded_bundled_amt: number | undefined;
  expenditure_purpose_descrip: string | undefined;
  category_code: string | undefined;
  beneficiary_committee_fec_id: string | undefined;
  beneficiary_committee_name: string | undefined;
  beneficiary_candidate_fec_id: string | undefined;
  beneficiary_candidate_last_name: string | undefined;
  beneficiary_candidate_first_name: string | undefined;
  beneficiary_candidate_middle_name: string | undefined;
  beneficiary_candidate_prefix: string | undefined;
  beneficiary_candidate_suffix: string | undefined;
  beneficiary_candidate_office: string | undefined;
  beneficiary_candidate_state: string | undefined;
  beneficiary_candidate_district: string | undefined;
  conduit_name: string | undefined;
  conduit_street1: string | undefined;
  conduit_street2: string | undefined;
  conduit_city: string | undefined;
  conduit_state: string | undefined;
  conduit_zip: string | undefined;
  memo_code: boolean | undefined;
  memo_text_description: string | undefined;
  reference_to_si_or_sl_system_code_that_identifies_the_account: string | undefined;

  // prettier-ignore
  static fromJSON(json: any): SchBTransaction { // eslint-disable-line @typescript-eslint/no-explicit-any
    return plainToClass(SchBTransaction, json);
  }
}

export enum ScheduleBTransactionTypes {
  OPERATING_EXPENDITURE = 'OPERATING_EXPENDITURE',
}

export const ScheduleBTransactionTypeLabels: LabelList = [
  [ScheduleBTransactionTypes.OPERATING_EXPENDITURE, 'Operating Expenditure'],
];
