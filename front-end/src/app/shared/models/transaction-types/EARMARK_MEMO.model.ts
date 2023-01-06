import { schema } from 'fecfile-validate/fecfile_validate_js/dist/EARMARK_MEMO';
import { AggregationGroups, SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';
import { SchaTransactionType } from './SchaTransactionType.model';

export class EARMARK_MEMO extends SchaTransactionType {
  scheduleId = 'A';
  componentGroupId = 'AG';
  isDependentChild = true;
  title = '';
  schema = schema;
  override transaction?: SchATransaction;

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
