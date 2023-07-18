import { schema } from 'fecfile-validate/fecfile_validate_js/dist/NATIONAL_PARTY_EARMARK_MEMOS';
import { SchATransactionType } from '../scha-transaction-type.model';
import { SchATransaction, ScheduleATransactionTypes, ScheduleATransactionTypeLabels } from '../scha-transaction.model';
import { AggregationGroups } from '../transaction.model';
import { TemplateMapKeyType } from '../transaction-type.model';
import { LabelUtils } from '../../utils/label.utils';
import { GROUP_G } from 'app/shared/utils/transaction-type-properties';
import { EARMARK_MEMO } from 'app/shared/utils/transaction-type-labels.utils';

export class EARMARK_MEMO_CONVENTION_ACCOUNT extends SchATransactionType {
  formFieldsConfig = GROUP_G;
  override labelConfig = EARMARK_MEMO;
  override isDependentChild = true;
  title = LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.EARMARK_MEMO_CONVENTION_ACCOUNT);
  schema = schema;
  override inheritedFields = ['amount' as TemplateMapKeyType];

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
