import { schema } from 'fecfile-validate/fecfile_validate_js/dist/NATIONAL_PARTY_EARMARK_MEMOS';
import { SchATransactionType } from '../scha-transaction-type.model';
import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';
import { TransactionGroupAG } from '../transaction-groups/transaction-group-ag.model';
import { AggregationGroups } from '../transaction.model';

export class EARMARK_MEMO_CONVENTION_ACCOUNT extends SchATransactionType {
  transactionGroup = new TransactionGroupAG();
  override isDependentChild = true;
  title = '';
  schema = schema;

  override generatePurposeDescription(): string {
    return 'Total earmarked through conduit.';
  }

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA17',
      transaction_type_identifier: ScheduleATransactionTypes.EARMARK_MEMO_CONVENTION_ACCOUNT,
      aggregation_group: AggregationGroups.NATIONAL_PARTY_CONVENTION_ACCOUNT,
      memo_code: true,
    });
  }
}
