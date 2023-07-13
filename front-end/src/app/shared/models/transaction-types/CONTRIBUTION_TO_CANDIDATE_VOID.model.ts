import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/CANDIDATE_CONTRIBUTIONS';
import { SchBTransactionType } from '../schb-transaction-type.model';
import { SchBTransaction, ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { TransactionGroupM } from '../transaction-groups/transaction-group-m.model';
import { STANDARD_CONTROLS, TransactionNavigationControls } from '../transaction-navigation-controls.model';
import { PurposeDescriptionLabelSuffix } from '../transaction-type.model';
import { GROUP_M } from 'app/shared/utils/transaction-type-properties';

export class CONTRIBUTION_TO_CANDIDATE_VOID extends SchBTransactionType {
  transactionGroup = new TransactionGroupM();
  formProperties = GROUP_M;
  title = LabelUtils.get(ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes.CONTRIBUTION_TO_CANDIDATE_VOID);
  schema = schema;
  override negativeAmountValueOnly = true;
  override showAggregate = false;
  override purposeDescriptionLabelSuffix = PurposeDescriptionLabelSuffix.REQUIRED;
  override navigationControls: TransactionNavigationControls = STANDARD_CONTROLS;

  getNewTransaction() {
    return SchBTransaction.fromJSON({
      form_type: 'SB23',
      transaction_type_identifier: ScheduleBTransactionTypes.CONTRIBUTION_TO_CANDIDATE_VOID,
    });
  }
}
