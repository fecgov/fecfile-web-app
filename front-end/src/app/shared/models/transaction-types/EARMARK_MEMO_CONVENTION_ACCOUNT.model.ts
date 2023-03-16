import { schema } from 'fecfile-validate/fecfile_validate_js/dist/NATIONAL_PARTY_EARMARK_MEMOS';
import { AggregationGroups } from '../transaction.model';
import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';
import { SchATransactionType } from '../scha-transaction-type.model';

export class EARMARK_MEMO_CONVENTION_ACCOUNT extends SchATransactionType {
  componentGroupId = 'AG';
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
