import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/PARTY_JF_TRANSFER_MEMO';
import { AggregationGroups } from '../transaction.model';
import { SchATransaction, ScheduleATransactionTypeLabels, ScheduleATransactionTypes } from '../scha-transaction.model';
import { CHILD_CONTROLS } from '../transaction-navigation-controls.model';
import { SchATransactionType } from '../scha-transaction-type.model';
import { COMMITTEE, COMMITTEE_FORM_FIELDS } from 'app/shared/utils/transaction-type-properties';

export class PARTY_JF_TRANSFER_MEMO extends SchATransactionType {
  formFields = COMMITTEE_FORM_FIELDS;
  contactTypeOptions = COMMITTEE;
  title = LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.PARTY_JF_TRANSFER_MEMO);
  override shortName = 'Party';
  schema = schema;
  override navigationControls = CHILD_CONTROLS;

  override generatePurposeDescription(transaction: SchATransaction): string {
    return `JF Memo: ${(transaction.parent_transaction as SchATransaction).contributor_organization_name}`;
  }

  getNewTransaction(properties = {}) {
    return SchATransaction.fromJSON({
      ...{
        form_type: 'SA12',
        transaction_type_identifier: ScheduleATransactionTypes.PARTY_JF_TRANSFER_MEMO,
        aggregation_group: AggregationGroups.GENERAL,
      },
      ...properties,
    });
  }
}
