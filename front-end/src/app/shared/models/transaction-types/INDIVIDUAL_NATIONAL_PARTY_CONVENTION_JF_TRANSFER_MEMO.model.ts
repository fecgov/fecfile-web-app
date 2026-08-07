import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/INDIVIDUAL_NATIONAL_PARTY_CONVENTION_JF_TRANSFER_MEMO';
import { SchATransaction } from '../transaction/schedule-a/scha-transaction.model';
import { CHILD_CONTROLS } from '../transaction/transaction-navigation-controls.model';
import { INDIVIDUAL_FORM_FIELDS, INDIVIDUAL } from 'app/shared/utils/transaction-type-properties';
import { SCHEDULE_A_MEMO } from './common-types/SCHEDULE_A_MEMO.model';
import { AggregationGroups } from '../transaction/agregation-groups.model';
import {
  ScheduleATransactionTypeLabels,
  ScheduleATransactionTypes,
} from '../transaction/schedule-a/schedule-a-transaction-types.model';

export class INDIVIDUAL_NATIONAL_PARTY_CONVENTION_JF_TRANSFER_MEMO extends SCHEDULE_A_MEMO {
  formFields = INDIVIDUAL_FORM_FIELDS;
  contactTypeOptions = INDIVIDUAL;
  title = LabelUtils.get(
    ScheduleATransactionTypeLabels,
    ScheduleATransactionTypes.INDIVIDUAL_NATIONAL_PARTY_CONVENTION_JF_TRANSFER_MEMO,
  );
  override shortName = 'Individual';
  schema = schema;
  override navigationControls = CHILD_CONTROLS;

  override generatePurposeDescription(transaction: SchATransaction): string {
    return `Pres. Nominating Convention Account JF Memo: ${
      (transaction.parent_transaction as SchATransaction).contributor_organization_name
    }`;
  }

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA17',
      transaction_type_identifier: ScheduleATransactionTypes.INDIVIDUAL_NATIONAL_PARTY_CONVENTION_JF_TRANSFER_MEMO,
      aggregation_group: AggregationGroups.NATIONAL_PARTY_CONVENTION_ACCOUNT,
    });
  }
}
