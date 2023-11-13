import { schema } from 'fecfile-validate/fecfile_validate_js/dist/NATIONAL_PARTY_EARMARK_MEMOS';
import { SchATransaction, ScheduleATransactionTypes, ScheduleATransactionTypeLabels } from '../scha-transaction.model';
import { AggregationGroups } from '../transaction.model';
import { LabelUtils } from '../../utils/label.utils';
import { EARMARK_MEMO } from './common-types/EARMARK_MEMO.model';

export class EARMARK_MEMO_CONVENTION_ACCOUNT extends EARMARK_MEMO {
  title = LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.EARMARK_MEMO_CONVENTION_ACCOUNT);
  schema = schema;

  getNewTransaction(properties = {}) {
    return SchATransaction.fromJSON({
      ...{
        form_type: 'SA17',
        transaction_type_identifier: ScheduleATransactionTypes.EARMARK_MEMO_CONVENTION_ACCOUNT,
        aggregation_group: AggregationGroups.NATIONAL_PARTY_CONVENTION_ACCOUNT,
        memo_code: true,
      },
      ...properties,
    });
  }
}
