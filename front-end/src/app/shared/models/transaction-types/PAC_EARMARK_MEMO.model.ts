import { schema } from 'fecfile-validate/fecfile_validate_js/dist/PAC_EARMARK_MEMO';
import { SchATransaction } from '../transaction/schedule-a/scha-transaction.model';
import { LabelUtils } from 'app/shared/utils/label.utils';
import { EARMARK_MEMO } from './common-types/EARMARK_MEMO.model';
import { AggregationGroups } from '../transaction/agregation-groups.model';
import {
  ScheduleATransactionTypeLabels,
  ScheduleATransactionTypes,
} from '../transaction/schedule-a/schedule-a-transaction-types.model';

export class PAC_EARMARK_MEMO extends EARMARK_MEMO {
  title = LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.PAC_EARMARK_MEMO);
  schema = schema;

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA11C',
      transaction_type_identifier: ScheduleATransactionTypes.PAC_EARMARK_MEMO,
      aggregation_group: AggregationGroups.GENERAL,
      memo_code: true,
    });
  }
}
