import { LabelUtils } from 'app/shared/utils/label.utils';
import { TransactionTypeUtils } from 'app/shared/utils/transaction-type.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/NATIONAL_PARTY_EARMARK_RECEIPTS';
import { ContactTypes } from '../contact.model';
import {
  AggregationGroups,
  SchATransaction,
  ScheduleATransactionTypeLabels,
  ScheduleATransactionTypes,
} from '../scha-transaction.model';
import {
  CANCEL_CONTROL,
  SAVE_LIST_CONTROL,
  TransactionNavigationControls,
} from '../transaction-navigation-controls.model';
import { SchaTransactionType } from './SchaTransactionType.model';

export class EARMARK_RECEIPT_HEADQUARTERS_ACCOUNT extends SchaTransactionType {
  componentGroupId = 'GG';
  title = LabelUtils.get(
    ScheduleATransactionTypeLabels,
    ScheduleATransactionTypes.EARMARK_RECEIPT_FOR_HEADQUARTERS_ACCOUNT_CONTRIBUTION
  );
  schema = schema;
  override childTransactionType = TransactionTypeUtils.factory(ScheduleATransactionTypes.EARMARK_MEMO);
  override navigationControls: TransactionNavigationControls = new TransactionNavigationControls(
    [],
    [CANCEL_CONTROL],
    [SAVE_LIST_CONTROL]
  );

  override generatePurposeDescription(): string {
    const earmarkMemo: SchATransaction = this.childTransactionType?.transaction as SchATransaction;
    let conduit = earmarkMemo?.contributor_organization_name || '';
    if (
      earmarkMemo?.entity_type === ContactTypes.INDIVIDUAL &&
      earmarkMemo?.contributor_first_name &&
      earmarkMemo?.contributor_last_name
    ) {
      conduit = `${earmarkMemo.contributor_first_name || ''} ${earmarkMemo.contributor_last_name || ''}`;
    }
    if (conduit) {
      return `Headquarters Buildings Account - Earmarked through ${conduit}`;
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
