import { schema } from 'fecfile-validate/fecfile_validate_js/dist/PAC_EARMARK_MEMO';
import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';
import { AggregationGroups } from '../transaction.model';
import { SchaTransactionType } from './SchaTransactionType.model';

export class PAC_EARMARK_MEMO extends SchaTransactionType {
  componentGroupId = 'FG';
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
