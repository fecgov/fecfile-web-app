import { schema } from 'fecfile-validate/fecfile_validate_js/dist/CONDUIT_EARMARKS';
import { SchATransactionType } from '../scha-transaction-type.model';
import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';
import { SchBTransaction, ScheduleBTransactionTypes } from '../schb-transaction.model';
import {
  STANDARD_DOUBLE_ENTRY_CONTROLS,
  TransactionNavigationControls,
} from '../transaction-navigation-controls.model';
import { TemplateMapKeyType } from '../transaction-type.model';
import { TransactionGroupNM } from '../transaction-groups/transaction-group-nm.model';

export class CONDUIT_EARMARK_RECEIPT extends SchATransactionType {
  transactionGroup = new TransactionGroupNM();
  title = 'Conduit Earmark';
  schema = schema;
  override dependentChildTransactionType = ScheduleBTransactionTypes.CONDUIT_EARMARK_OUT;
  override navigationControls: TransactionNavigationControls = STANDARD_DOUBLE_ENTRY_CONTROLS;
  override childTriggerFields = ['organization_name', 'last_name', 'first_name'] as TemplateMapKeyType[];
  override showAggregate = false;
  override apiEndpoint = '/transactions/save-pair';
  override memoCodeMap = {
    true: 'Undeposited',
    false: 'Deposited',
  };
  override memoCodeTransactionTypes = {
    true: ScheduleATransactionTypes.CONDUIT_EARMARK_RECEIPT_UNDEPOSITED,
    false: ScheduleATransactionTypes.CONDUIT_EARMARK_RECEIPT_DEPOSITED,
  };

  override generatePurposeDescription(transaction: SchATransaction): string {
    if (!transaction.children?.length) return '';
    const earmarkMemo: SchBTransaction = transaction.children[0] as SchBTransaction;
    if (earmarkMemo.payee_organization_name) {
      const conduit = earmarkMemo.payee_organization_name;
      return `Earmarked for ${conduit} (Committee)`;
    }
    return '';
  }

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA11AI',
      transaction_type_identifier: ScheduleATransactionTypes.CONDUIT_EARMARK_RECEIPT_DEPOSITED,
      memo_code: false,
    });
  }
}
