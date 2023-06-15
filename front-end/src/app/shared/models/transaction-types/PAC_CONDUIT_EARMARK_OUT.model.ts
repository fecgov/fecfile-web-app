import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/CONDUIT_EARMARK_OUTS';
import { SchBTransactionType } from '../schb-transaction-type.model';
import { SchBTransaction, ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes } from '../schb-transaction.model';
import {
  STANDARD_DOUBLE_ENTRY_CONTROLS,
  TransactionNavigationControls,
} from '../transaction-navigation-controls.model';
import { TransactionGroupPM } from '../transaction-groups/transaction-group-pm.model';

export class PAC_CONDUIT_EARMARK_OUT extends SchBTransactionType {
  transactionGroup = new TransactionGroupPM();
  override isDependentChild = true;
  override showAggregate = false;
  title = LabelUtils.get(ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes.PAC_CONDUIT_EARMARK_OUT);
  schema = schema;
  override apiEndpoint = '/transactions/save-pair';
  override dependentChildTransactionType = ScheduleBTransactionTypes.PAC_CONDUIT_EARMARK_OUT;
  override navigationControls: TransactionNavigationControls = STANDARD_DOUBLE_ENTRY_CONTROLS;

  getNewTransaction() {
    return SchBTransaction.fromJSON({
      form_type: 'SB23',
      transaction_type_identifier: ScheduleBTransactionTypes.PAC_CONDUIT_EARMARK_OUT,
    });
  }
}
