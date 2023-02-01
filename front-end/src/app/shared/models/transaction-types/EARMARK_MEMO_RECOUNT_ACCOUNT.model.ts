import { schema } from 'fecfile-validate/fecfile_validate_js/dist/NATIONAL_PARTY_EARMARK_MEMOS';
import { AggregationGroups, SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';
import { SchaTransactionType } from './SchaTransactionType.model';

export class EARMARK_MEMO_RECOUNT_ACCOUNT extends SchaTransactionType {
  componentGroupId = 'GG';
  override isDependentChild = true;
  title = '';
  schema = schema;

  override purposeDescriptionGenerator(): string {
    return 'Total earmarked through conduit.';
  }

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA17',
      transaction_type_identifier: ScheduleATransactionTypes.EARMARK_MEMO_RECOUNT_ACCOUNT,
      aggregation_group: AggregationGroups.NATIONAL_PARTY_RECOUNT_ACCOUNT,
      memo_code: true,
    });
  }
}
