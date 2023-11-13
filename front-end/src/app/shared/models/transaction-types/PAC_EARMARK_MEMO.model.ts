import { schema } from 'fecfile-validate/fecfile_validate_js/dist/PAC_EARMARK_MEMO';
import { SchATransaction, ScheduleATransactionTypes, ScheduleATransactionTypeLabels } from '../scha-transaction.model';
import { AggregationGroups } from '../transaction.model';
import { LabelUtils } from 'app/shared/utils/label.utils';
import { EARMARK_MEMO } from './common-types/EARMARK_MEMO.model';

export class PAC_EARMARK_MEMO extends EARMARK_MEMO {
  title = LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.PAC_EARMARK_MEMO);
  schema = schema;

  getNewTransaction(properties = {}) {
    return SchATransaction.fromJSON({
      ...{
        form_type: 'SA11C',
        transaction_type_identifier: ScheduleATransactionTypes.PAC_EARMARK_MEMO,
        aggregation_group: AggregationGroups.GENERAL,
        memo_code: true,
      },
      ...properties,
    });
  }
}
