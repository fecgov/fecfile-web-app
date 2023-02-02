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
import { SchaTransactionType } from './SchaTransactionType.model';

export class EARMARK_RECEIPT_RECOUNT_ACCOUNT extends SchaTransactionType {
  componentGroupId = 'AG';
  title = LabelUtils.get(
    ScheduleATransactionTypeLabels,
    ScheduleATransactionTypes.EARMARK_RECEIPT_FOR_RECOUNT_ACCOUNT_CONTRIBUTION
  );
  schema = schema;
  override childTransactionType = TransactionTypeUtils.factory(ScheduleATransactionTypes.EARMARK_MEMO_RECOUNT_ACCOUNT);
  override navigationControls: TransactionNavigationControls = new TransactionNavigationControls(
    [],
    [CANCEL_CONTROL],
    [SAVE_LIST_CONTROL]
  );

  override generatePurposeDescription(): string {
    const subTransaction: SchATransaction = this.childTransactionType?.transaction as SchATransaction;
    let conduit = subTransaction?.contributor_organization_name || '';
    if (
      subTransaction?.entity_type === ContactTypes.INDIVIDUAL &&
      subTransaction?.contributor_first_name &&
      subTransaction?.contributor_last_name
    ) {
      conduit = `${subTransaction.contributor_first_name || ''} ${subTransaction.contributor_last_name || ''}`;
    }
    if (conduit) {
      return `Recount/Legal Proceedings Account - Earmarked Through ${conduit}`;
    }
    return '';
  }

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA17',
      transaction_type_identifier: ScheduleATransactionTypes.EARMARK_RECEIPT_FOR_RECOUNT_ACCOUNT_CONTRIBUTION,
      aggregation_group: AggregationGroups.NATIONAL_PARTY_RECOUNT_ACCOUNT,
    });
  }
}
