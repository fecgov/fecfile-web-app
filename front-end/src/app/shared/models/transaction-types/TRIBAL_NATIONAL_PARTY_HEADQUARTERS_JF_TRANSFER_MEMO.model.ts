import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/TRIBAL_NATIONAL_PARTY_HEADQUARTERS_JF_TRANSFER_MEMO';
import { SchATransactionType } from '../scha-transaction-type.model';
import { SchATransaction, ScheduleATransactionTypeLabels, ScheduleATransactionTypes } from '../scha-transaction.model';
import { CHILD_CONTROLS } from '../transaction-navigation-controls.model';
import { AggregationGroups } from '../transaction.model';
import { ORGANIZATION_FORM_FIELDS, ORGANIZATION } from 'app/shared/utils/transaction-type-properties';

export class TRIBAL_NATIONAL_PARTY_HEADQUARTERS_JF_TRANSFER_MEMO extends SchATransactionType {
  formFields = ORGANIZATION_FORM_FIELDS;
  contactTypeOptions = ORGANIZATION;
  title = LabelUtils.get(
    ScheduleATransactionTypeLabels,
    ScheduleATransactionTypes.TRIBAL_NATIONAL_PARTY_HEADQUARTERS_JF_TRANSFER_MEMO,
  );
  override shortName = 'Tribal';
  schema = schema;
  override navigationControls = CHILD_CONTROLS;

  override generatePurposeDescription(transaction: SchATransaction): string {
    return `Headquarters Buildings Account JF Memo: ${
      (transaction.parent_transaction as SchATransaction).contributor_organization_name
    }`;
  }

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA17',
      transaction_type_identifier: ScheduleATransactionTypes.TRIBAL_NATIONAL_PARTY_HEADQUARTERS_JF_TRANSFER_MEMO,
      aggregation_group: AggregationGroups.NATIONAL_PARTY_HEADQUARTERS_ACCOUNT,
    });
  }
}
