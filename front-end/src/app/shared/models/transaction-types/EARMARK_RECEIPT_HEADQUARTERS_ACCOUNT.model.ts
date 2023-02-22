import { LabelUtils } from 'app/shared/utils/label.utils';
import { TransactionTypeUtils } from 'app/shared/utils/transaction-type.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/NATIONAL_PARTY_EARMARK_RECEIPTS';
import { ContactTypes } from '../contact.model';
import { AggregationGroups } from '../transaction.model';
import { SchATransaction, ScheduleATransactionTypeLabels, ScheduleATransactionTypes } from '../scha-transaction.model';
import {
  CANCEL_CONTROL,
  SAVE_LIST_CONTROL,
  TransactionNavigationControls,
} from '../transaction-navigation-controls.model';
import { SchATransactionType } from '../scha-transaction-type.model';

export class EARMARK_RECEIPT_HEADQUARTERS_ACCOUNT extends SchATransactionType {
  componentGroupId = 'AG';
  title = LabelUtils.get(
    ScheduleATransactionTypeLabels,
    ScheduleATransactionTypes.EARMARK_RECEIPT_FOR_HEADQUARTERS_ACCOUNT_CONTRIBUTION
  );
  schema = schema;
  override dependentChildTransactionType = TransactionTypeUtils.factory(
    ScheduleATransactionTypes.EARMARK_MEMO_HEADQUARTERS_ACCOUNT
  );
  override navigationControls: TransactionNavigationControls = new TransactionNavigationControls(
    [],
    [CANCEL_CONTROL],
    [SAVE_LIST_CONTROL]
  );

  override generatePurposeDescription(transaction: SchATransaction): string {
    if (!transaction.children) return '';
    const subTransaction: SchATransaction = transaction.children[0] as SchATransaction;
    let conduit = subTransaction.contributor_organization_name || '';
    if (
      subTransaction.entity_type === ContactTypes.INDIVIDUAL &&
      subTransaction.contributor_first_name &&
      subTransaction.contributor_last_name
    ) {
      conduit = `${subTransaction.contributor_first_name || ''} ${subTransaction.contributor_last_name || ''}`;
    }
    if (conduit) {
      return `Headquarters Buildings Account - Earmarked Through ${conduit}`;
    }
    return '';
  }

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA17',
      transaction_type_identifier: ScheduleATransactionTypes.EARMARK_RECEIPT_FOR_HEADQUARTERS_ACCOUNT_CONTRIBUTION,
      aggregation_group: AggregationGroups.NATIONAL_PARTY_HEADQUARTERS_ACCOUNT,
    });
  }
}
