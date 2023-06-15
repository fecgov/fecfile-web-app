import { schema } from 'fecfile-validate/fecfile_validate_js/dist/EARMARK_RECEIPT';
import { ContactTypes } from '../contact.model';
import { SchBTransaction } from '../schb-transaction.model';
import { TransactionGroupAG } from '../transaction-groups/transaction-group-ag.model';
import { AggregationGroups } from '../transaction.model';
import { ScheduleBTransactionTypes } from '../schb-transaction.model';
import { SchBTransactionType } from '../schb-transaction-type.model';
import { TemplateMapKeyType } from '../transaction-type.model';

export class CONDUIT_EARMARK_OUT_DEPOSITED extends SchBTransactionType {
  transactionGroup = new TransactionGroupAG();
  title = 'Conduit Earmark Receipt';
  schema = schema;
  override isDependentChild = true;
  override inherittedFields = ['amount' as TemplateMapKeyType];
  override memoCodeMap = {
    true: 'Undeposited',
    false: 'Deposited',
  };

  override generatePurposeDescription(transaction: SchBTransaction): string {
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
    return SchBTransaction.fromJSON({
      form_type: 'SA11AI',
      transaction_type_identifier: ScheduleBTransactionTypes.CONDUIT_EARMARK_OUT_DEPOSITED,
      aggregation_group: AggregationGroups.NONE,
    });
  }
}
