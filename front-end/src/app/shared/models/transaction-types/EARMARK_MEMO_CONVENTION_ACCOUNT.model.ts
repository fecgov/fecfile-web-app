import { schema } from 'fecfile-validate/fecfile_validate_js/dist/NATIONAL_PARTY_EARMARK_MEMOS';
import { LabelUtils } from '../../utils/label.utils';
import { ABSTRACT_EARMARK_MEMO } from './ABSTRACT_EARMARK_MEMO.model';
import { ScheduleATransactionTypeLabels, ScheduleATransactionTypes, AggregationGroups } from '../type-enums';

export class EARMARK_MEMO_CONVENTION_ACCOUNT extends ABSTRACT_EARMARK_MEMO {
  title = LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.EARMARK_MEMO_CONVENTION_ACCOUNT);
  schema = schema;

  override readonly initializationData = {
    form_type: 'SA17',
    transaction_type_identifier: ScheduleATransactionTypes.EARMARK_MEMO_CONVENTION_ACCOUNT,
    aggregation_group: AggregationGroups.NATIONAL_PARTY_CONVENTION_ACCOUNT,
    memo_code: true,
  };
}
