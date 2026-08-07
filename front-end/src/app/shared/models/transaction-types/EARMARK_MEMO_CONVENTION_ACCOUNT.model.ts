import { schema } from 'fecfile-validate/fecfile_validate_js/dist/NATIONAL_PARTY_EARMARK_MEMOS';
import { SchATransaction } from '../transaction/schedule-a/scha-transaction.model';
import { LabelUtils } from '../../utils/label.utils';
import { EARMARK_MEMO } from './common-types/EARMARK_MEMO.model';
import { AggregationGroups } from '../transaction/agregation-groups.model';
import {
  ScheduleATransactionTypeLabels,
  ScheduleATransactionTypes,
} from '../transaction/schedule-a/schedule-a-transaction-types.model';

export class EARMARK_MEMO_CONVENTION_ACCOUNT extends EARMARK_MEMO {
  title = LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.EARMARK_MEMO_CONVENTION_ACCOUNT);
  schema = schema;

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA17',
      transaction_type_identifier: ScheduleATransactionTypes.EARMARK_MEMO_CONVENTION_ACCOUNT,
      aggregation_group: AggregationGroups.NATIONAL_PARTY_CONVENTION_ACCOUNT,
      memo_code: true,
    });
  }
}
