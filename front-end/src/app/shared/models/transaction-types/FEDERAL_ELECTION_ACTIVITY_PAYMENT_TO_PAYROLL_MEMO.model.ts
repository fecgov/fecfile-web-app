import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/DISBURSEMENT_MEMOS_FEA';
import { CHILD_CONTROLS } from '../transaction-navigation-controls.model';
import {
  INDIVIDUAL_ORGANIZATION_ELECTION_B_FORM_FIELDS,
  INDIVIDUAL_ORGANIZATION_COMMITTEE,
} from 'app/shared/utils/transaction-type-properties';
import { ABSTRACT_SCHEDULE_B_MEMO } from './ABSTRACT_SCHEDULE_B_MEMO.model';
import { ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes, AggregationGroups } from '../type-enums';

export class FEDERAL_ELECTION_ACTIVITY_PAYMENT_TO_PAYROLL_MEMO extends ABSTRACT_SCHEDULE_B_MEMO {
  formFields = INDIVIDUAL_ORGANIZATION_ELECTION_B_FORM_FIELDS;
  contactTypeOptions = INDIVIDUAL_ORGANIZATION_COMMITTEE;
  title = LabelUtils.get(
    ScheduleBTransactionTypeLabels,
    ScheduleBTransactionTypes.FEDERAL_ELECTION_ACTIVITY_PAYMENT_TO_PAYROLL_MEMO,
  );
  schema = schema;
  override navigationControls = CHILD_CONTROLS;

  override readonly initializationData = {
    form_type: 'SB30B',
    transaction_type_identifier: ScheduleBTransactionTypes.FEDERAL_ELECTION_ACTIVITY_PAYMENT_TO_PAYROLL_MEMO,
    aggregation_group: AggregationGroups.GENERAL_DISBURSEMENT,
  };
}
