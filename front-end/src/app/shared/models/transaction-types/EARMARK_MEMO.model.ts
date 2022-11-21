import { TransactionType } from '../../interfaces/transaction-type.interface';
import { SchATransaction, ScheduleATransactionTypes, AggregationGroups } from '../scha-transaction.model';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/EARMARK_MEMO';

export class EARMARK_MEMO implements TransactionType {
  scheduleId = 'A';
  componentGroupId = 'AG';
  isDependentChild = true;
  title = '';
  schema = schema;
  transaction?: SchATransaction;

  contributionPurposeDescripReadonly(): string {
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
