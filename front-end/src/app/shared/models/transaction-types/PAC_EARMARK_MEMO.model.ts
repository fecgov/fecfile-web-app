import { schema } from 'fecfile-validate/fecfile_validate_js/dist/PAC_EARMARK_MEMO';
import { SchATransactionType } from '../scha-transaction-type.model';
import { SchATransaction, ScheduleATransactionTypes, ScheduleATransactionTypeLabels } from '../scha-transaction.model';
import { TransactionGroupFG } from '../transaction-groups/transaction-group-fg.model';
import { AggregationGroups } from '../transaction.model';
import { TemplateMapKeyType } from '../transaction-type.model';
import { LabelUtils } from 'app/shared/utils/label.utils';
import { GROUP_EFI } from 'app/shared/utils/transaction-type-properties';

export class PAC_EARMARK_MEMO extends SchATransactionType {
  transactionGroup = new TransactionGroupFG();
  formProperties = GROUP_EFI;
  override isDependentChild = true;
  title = LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.PAC_EARMARK_MEMO);
  schema = schema;
  override inheritedFields = ['amount' as TemplateMapKeyType];

  override generatePurposeDescription(): string {
    return 'Total earmarked through conduit.';
  }

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA11C',
      transaction_type_identifier: ScheduleATransactionTypes.PAC_EARMARK_MEMO,
      aggregation_group: AggregationGroups.GENERAL,
      memo_code: true,
    });
  }
}
