import { schema } from 'fecfile-validate/fecfile_validate_js/dist/EARMARK_RECEIPT';
import { ContactTypes } from '../contact.model';
import { SchATransactionType } from '../scha-transaction-type.model';
import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';
import { SchBTransaction } from '../schb-transaction.model';
import { TransactionGroupAG } from '../transaction-groups/transaction-group-ag.model';
import {
  STANDARD_DOUBLE_ENTRY_CONTROLS,
  TransactionNavigationControls,
} from '../transaction-navigation-controls.model';
import { AggregationGroups } from '../transaction.model';
import { TemplateMapKeyType } from '../transaction-type.model';
import { ScheduleBTransactionTypes } from '../schb-transaction.model';

export class CONDUIT_EARMARK_RECEIPT_DEPOSITED extends SchATransactionType {
  transactionGroup = new TransactionGroupAG();
  title = 'Conduit Earmark Receipt';
  schema = schema;
  override dependentChildTransactionType = ScheduleBTransactionTypes.CONDUIT_EARMARK_OUT_DEPOSITED;
  override navigationControls: TransactionNavigationControls = STANDARD_DOUBLE_ENTRY_CONTROLS;
  override childTriggerFields = ['organization_name', 'last_name', 'first_name'] as TemplateMapKeyType[];
  override memoCodeMap = {
    true: 'Undeposited',
    false: 'Deposited',
  };

  override generatePurposeDescription(transaction: SchATransaction): string {
    if (!transaction.children) return '';
    const earmarkMemo: SchBTransaction = transaction.children[0] as SchBTransaction;
    let conduit = '';
    if (earmarkMemo.payee_organization_name) {
      conduit = earmarkMemo.payee_organization_name;
    }
    if (
      earmarkMemo.entity_type === ContactTypes.INDIVIDUAL &&
      earmarkMemo.payee_first_name &&
      earmarkMemo.payee_last_name
    ) {
      conduit = `${earmarkMemo.payee_first_name || ''} ${earmarkMemo.payee_last_name || ''}`;
    }
    if (conduit) {
      return `Earmarked for ${conduit} (Committee)`;
    }
    return '';
  }

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA11AI',
      transaction_type_identifier: ScheduleATransactionTypes.CONDUIT_EARMARK_RECEIPT_DEPOSITED,
      aggregation_group: AggregationGroups.NONE,
    });
  }
}
