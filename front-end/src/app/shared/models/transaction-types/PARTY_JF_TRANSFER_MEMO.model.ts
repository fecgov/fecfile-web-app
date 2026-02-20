import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/PARTY_JF_TRANSFER_MEMO';
import type { SchATransaction } from '../scha-transaction.model';
import { CHILD_CONTROLS } from '../transaction-navigation-controls.model';
import { COMMITTEE, COMMITTEE_FORM_FIELDS } from 'app/shared/utils/transaction-type-properties';
import { ABSTRACT_SCHEDULE_A_MEMO } from './ABSTRACT_SCHEDULE_A_MEMO.model';
import { ScheduleATransactionTypeLabels, ScheduleATransactionTypes, AggregationGroups } from '../type-enums';

export class PARTY_JF_TRANSFER_MEMO extends ABSTRACT_SCHEDULE_A_MEMO {
  formFields = COMMITTEE_FORM_FIELDS;
  contactTypeOptions = COMMITTEE;
  title = LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.PARTY_JF_TRANSFER_MEMO);
  override shortName = 'Party';
  schema = schema;
  override navigationControls = CHILD_CONTROLS;

  override generatePurposeDescription(transaction: SchATransaction): string {
    return `JF Memo: ${(transaction.parent_transaction as SchATransaction).contributor_organization_name}`;
  }

  override readonly initializationData = {
    form_type: 'SA12',
    transaction_type_identifier: ScheduleATransactionTypes.PARTY_JF_TRANSFER_MEMO,
    aggregation_group: AggregationGroups.GENERAL,
  };
}
