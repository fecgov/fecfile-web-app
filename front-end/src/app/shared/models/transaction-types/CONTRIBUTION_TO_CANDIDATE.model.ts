import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/CANDIDATE_CONTRIBUTIONS';
import { SchBTransactionType } from '../schb-transaction-type.model';
import { SchBTransaction, ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { TransactionGroupM } from '../transaction-groups/transaction-group-m.model';
import { STANDARD_CONTROLS, TransactionNavigationControls } from '../transaction-navigation-controls.model';

export class CONTRIBUTION_TO_CANDIDATE extends SchBTransactionType {
  transactionGroup = new TransactionGroupM();
  title = LabelUtils.get(ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes.CONTRIBUTION_TO_CANDIDATE);
  schema = schema;
  override showAggregate = false;
  override navigationControls: TransactionNavigationControls = STANDARD_CONTROLS;

  getNewTransaction() {
    return SchBTransaction.fromJSON({
      form_type: 'SB23',
      transaction_type_identifier: ScheduleBTransactionTypes.CONTRIBUTION_TO_CANDIDATE,
    });
  }
}