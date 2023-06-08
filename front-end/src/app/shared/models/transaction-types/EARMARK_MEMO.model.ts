import { schema } from 'fecfile-validate/fecfile_validate_js/dist/EARMARK_MEMO';
import { SchATransactionType } from '../scha-transaction-type.model';
import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';
import { TransactionGroupAG } from '../transaction-groups/transaction-group-ag.model';
import { AggregationGroups } from '../transaction.model';
import { TemplateMapKeyType } from '../transaction-type.model';

export class EARMARK_MEMO extends SchATransactionType {
  transactionGroup = new TransactionGroupAG();
  override isDependentChild = true;
  title = '';
  schema = schema;
  override inherittedFields = ['amount' as TemplateMapKeyType];

  override generatePurposeDescription(): string {
    return 'Total earmarked through conduit.';
  }

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA11AI',
      transaction_type_identifier: ScheduleATransactionTypes.EARMARK_MEMO,
      aggregation_group: AggregationGroups.GENERAL,
      memo_code: true,
    });
  }
}
