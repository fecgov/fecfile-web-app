import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/OTHER_COMMITTEE_CONTRIBUTIONS';
import { SchBTransactionType } from '../schb-transaction-type.model';
import { SchBTransaction, ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { TransactionGroupE } from '../transaction-groups/transaction-group-e.model';
import { STANDARD_CONTROLS, TransactionNavigationControls } from '../transaction-navigation-controls.model';

export class CONTRIBUTION_TO_OTHER_COMMITTEE extends SchBTransactionType {
  transactionGroup = new TransactionGroupE();
  title = LabelUtils.get(ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes.CONTRIBUTION_TO_OTHER_COMMITTEE);
  schema = schema;
  override showAggregate = false;
  override isRefundAggregate = true;
  override navigationControls: TransactionNavigationControls = STANDARD_CONTROLS;

  getNewTransaction() {
    return SchBTransaction.fromJSON({
      form_type: 'SB23',
      transaction_type_identifier: ScheduleBTransactionTypes.CONTRIBUTION_TO_OTHER_COMMITTEE,
    });
  }
}