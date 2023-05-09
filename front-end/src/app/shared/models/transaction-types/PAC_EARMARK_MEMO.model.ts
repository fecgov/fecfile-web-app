import { schema } from 'fecfile-validate/fecfile_validate_js/dist/PAC_EARMARK_MEMO';
import { SchATransactionType } from '../scha-transaction-type.model';
import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';
import { TransactionGroupFG } from '../transaction-groups/transaction-group-fg.model';
import { AggregationGroups } from '../transaction.model';

export class PAC_EARMARK_MEMO extends SchATransactionType {
  transactionGroup = new TransactionGroupFG();
  override isDependentChild = true;
  title = '';
  schema = schema;

  override generatePurposeDescription(): string {
    return 'Total earmarked through conduit.';
  }

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA11C',
      transaction_type_identifier: ScheduleATransactionTypes.PAC_EARMARK_MEMO,
      aggregation_group: AggregationGroups.GENERAL,
      memo_code: true,
    });
  }
}
