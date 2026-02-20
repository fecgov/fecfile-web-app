import { Transaction } from './transaction.model';
import type { AggregationGroups } from './type-enums';

export class SchC2Transaction extends Transaction {
  guarantor_last_name: string | undefined;
  guarantor_first_name: string | undefined;
  guarantor_middle_name: string | undefined;
  guarantor_prefix: string | undefined;
  guarantor_suffix: string | undefined;
  guarantor_street_1: string | undefined;
  guarantor_street_2: string | undefined;
  guarantor_city: string | undefined;
  guarantor_state: string | undefined;
  guarantor_zip: string | undefined;
  guarantor_employer: string | undefined;
  guarantor_occupation: string | undefined;
  guaranteed_amount: number | undefined;

  entity_type: string | undefined;
  aggregation_group: AggregationGroups | undefined;
}
