import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/TRIBAL_NATIONAL_PARTY_HEADQUARTERS_JF_TRANSFER_MEMO';
import { AggregationGroups } from '../transaction.model';
import { SchATransaction, ScheduleATransactionTypeLabels, ScheduleATransactionTypes } from '../scha-transaction.model';
import { SchATransactionType } from '../scha-transaction-type.model';
import { TransactionNavigationControls, getChildNavigationControls } from '../transaction-navigation-controls.model';

export class TRIBAL_NATIONAL_PARTY_HEADQUARTERS_JF_TRANSFER_MEMO extends SchATransactionType {
  componentGroupId = 'D';
  title = LabelUtils.get(
    ScheduleATransactionTypeLabels,
    ScheduleATransactionTypes.TRIBAL_NATIONAL_PARTY_HEADQUARTERS_JF_TRANSFER_MEMO
  );
  override entityCategoryName = 'Tribal';
  schema = schema;
  override navigationControls: TransactionNavigationControls = getChildNavigationControls();

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
