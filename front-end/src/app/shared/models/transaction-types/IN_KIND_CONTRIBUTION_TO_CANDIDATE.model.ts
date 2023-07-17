import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/IN_KIND_CONTRIBUTIONS';
import { SchBTransactionType } from '../schb-transaction-type.model';
import { SchBTransaction, ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { TransactionGroupN } from '../transaction-groups/transaction-group-n.model';
import { STANDARD_CONTROLS, TransactionNavigationControls } from '../transaction-navigation-controls.model';

export class IN_KIND_CONTRIBUTION_TO_CANDIDATE extends SchBTransactionType {
  transactionGroup = new TransactionGroupN();
  title = LabelUtils.get(ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes.IN_KIND_CONTRIBUTION_TO_CANDIDATE);
  schema = schema;
  override showAggregate = false;
  override purposeDescriptionPrefix = 'In-Kind: ';
  override navigationControls: TransactionNavigationControls = STANDARD_CONTROLS;

  getNewTransaction() {
    return SchBTransaction.fromJSON({
      form_type: 'SA11AI',
      transaction_type_identifier: ScheduleBTransactionTypes.IN_KIND_CONTRIBUTION_TO_CANDIDATE,
    });
  }
}
