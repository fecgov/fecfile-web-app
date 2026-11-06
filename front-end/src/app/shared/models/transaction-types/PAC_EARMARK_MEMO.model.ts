import { schema } from 'fecfile-validate/fecfile_validate_js/dist/PAC_EARMARK_MEMO';
import { SchATransaction, ScheduleATransactionTypes, ScheduleATransactionTypeLabels } from '../scha-transaction.model';
import { AggregationGroups } from '../transaction.model';
import { LabelUtils } from 'app/shared/utils/label.utils';
import { EARMARK_MEMO } from './common-types/EARMARK_MEMO.model';
import { INDIVIDUAL_COMMITTEE_FORM_FIELDS } from 'app/shared/utils/transaction-type-properties';

export class PAC_EARMARK_MEMO extends EARMARK_MEMO {
  override formFields = INDIVIDUAL_COMMITTEE_FORM_FIELDS;
  title = LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.PAC_EARMARK_MEMO);
  schema = schema;

  getNewTransaction() {
    return SchATransaction.fromJSON({
      transaction_type_identifier: ScheduleATransactionTypes.PAC_EARMARK_MEMO,
      aggregation_group: AggregationGroups.GENERAL,
      memo_code: true,
    });
  }
}
