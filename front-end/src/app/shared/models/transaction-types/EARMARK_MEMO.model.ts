import { schema } from 'fecfile-validate/fecfile_validate_js/dist/EARMARK_MEMO';
import { SchATransaction, ScheduleATransactionTypes, ScheduleATransactionTypeLabels } from '../scha-transaction.model';
import { AggregationGroups } from '../transaction.model';
import { LabelUtils } from 'app/shared/utils/label.utils';
import { EARMARK_MEMO as CommonEarmarkMemo } from './common-types/EARMARK_MEMO.model';

export class EARMARK_MEMO extends CommonEarmarkMemo {
  title = LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.EARMARK_MEMO);
  schema = schema;

  getNewTransaction(properties = {}) {
    return SchATransaction.fromJSON({
      ...{
        form_type: 'SA11AI',
        transaction_type_identifier: ScheduleATransactionTypes.EARMARK_MEMO,
        aggregation_group: AggregationGroups.GENERAL,
        memo_code: true,
      },
      ...properties,
    });
  }
}
