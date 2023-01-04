import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/EARMARK_RECEIPT';
import { TransactionTypeUtils } from 'app/shared/utils/transaction-type.utils';
import { TransactionType } from '../../interfaces/transaction-type.interface';
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
import { ContactTypes } from '../contact.model';

export class EARMARK_RECEIPT implements TransactionType {
  scheduleId = 'A';
  componentGroupId = 'AG';
  isDependentChild = false;
  title = LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.EARMARK_RECEIPT);
  schema = schema;
  transaction?: SchATransaction;
  childTransactionType = TransactionTypeUtils.factory(ScheduleATransactionTypes.EARMARK_MEMO);
  navigationControls: TransactionNavigationControls = new TransactionNavigationControls(
    [],
    [CANCEL_CONTROL],
    [SAVE_LIST_CONTROL]
  );

  generatePurposeDescription(): string {
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
      return `Earmarked through ${conduit}`;
    }
    return '';
  }

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA11AI',
      transaction_type_identifier: ScheduleATransactionTypes.EARMARK_RECEIPT,
      aggregation_group: AggregationGroups.GENERAL,
    });
  }
}
