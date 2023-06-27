import { schema } from 'fecfile-validate/fecfile_validate_js/dist/PAC_CONDUIT_EARMARKS';
import { SchATransactionType } from '../scha-transaction-type.model';
import { SchATransaction, ScheduleATransactionTypeLabels, ScheduleATransactionTypes } from '../scha-transaction.model';
import {
  STANDARD_DOUBLE_ENTRY_CONTROLS,
  TransactionNavigationControls,
} from '../transaction-navigation-controls.model';
import { SchBTransaction, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { TransactionGroupPM } from '../transaction-groups/transaction-group-pm.model';
import { TemplateMapKeyType } from '../transaction-type.model';

export class PAC_CONDUIT_EARMARK extends SchATransactionType {
  transactionGroup = new TransactionGroupPM();
  title = 'PAC Conduit Earmark';
  schema = schema;
  override dependentChildTransactionType = ScheduleBTransactionTypes.PAC_CONDUIT_EARMARK_OUT;
  override navigationControls: TransactionNavigationControls = STANDARD_DOUBLE_ENTRY_CONTROLS;
  override childTriggerFields = ['organization_name', 'last_name', 'first_name'] as TemplateMapKeyType[];
  override showAggregate = false;
  override apiEndpoint = '/transactions/save-pair';
  override memoCodeMap = {
    true: 'Undeposited',
    false: 'Deposited',
  };
  override memoCodeTransactionTypes = {
    true: ScheduleATransactionTypes.PAC_CONDUIT_EARMARK_UNDEPOSITED,
    false: ScheduleATransactionTypes.PAC_CONDUIT_EARMARK_DEPOSITED,
  };
  override generatePurposeDescription(transaction: SchATransaction): string {
    if (!transaction.children?.length) return '';
    const earmarkMemo: SchBTransaction = transaction.children[0] as SchBTransaction;
    const conduit = earmarkMemo.payee_organization_name;
    if (conduit) {
      return `Earmarked for ${conduit} (Committee)`;
    }
    return '';
  }
  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA11C',
      transaction_type_identifier: ScheduleATransactionTypes.PAC_CONDUIT_EARMARK,
      memo_code: false,
    });
  }
}
