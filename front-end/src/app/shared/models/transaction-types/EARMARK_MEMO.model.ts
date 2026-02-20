import { schema } from 'fecfile-validate/fecfile_validate_js/dist/EARMARK_MEMO';

import { LabelUtils } from 'app/shared/utils/label.utils';
import { ABSTRACT_EARMARK_MEMO as CommonEarmarkMemo } from './ABSTRACT_EARMARK_MEMO.model';
import { ScheduleATransactionTypeLabels, ScheduleATransactionTypes, AggregationGroups } from '../type-enums';

export class EARMARK_MEMO extends CommonEarmarkMemo {
  title = LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.EARMARK_MEMO);
  schema = schema;

  override readonly initializationData = {
    form_type: 'SA11AI',
    transaction_type_identifier: ScheduleATransactionTypes.EARMARK_MEMO,
    aggregation_group: AggregationGroups.GENERAL,
    memo_code: true,
  };
}
