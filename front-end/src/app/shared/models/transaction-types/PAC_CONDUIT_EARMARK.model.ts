import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/PAC_CONDUIT_EARMARKS';
import { SchATransactionType } from '../scha-transaction-type.model';
import { SchATransaction, ScheduleATransactionTypeLabels, ScheduleATransactionTypes } from '../scha-transaction.model';
import {
  STANDARD_DOUBLE_ENTRY_CONTROLS,
  TransactionNavigationControls,
} from '../transaction-navigation-controls.model';
import { ScheduleBTransactionTypes } from '../schb-transaction.model';
import { TransactionGroupPM } from '../transaction-groups/transaction-group-pm.model';

export class PAC_CONDUIT_EARMARK extends SchATransactionType {
  transactionGroup = new TransactionGroupPM();
  title = LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.PAC_CONDUIT_EARMARK);
  schema = schema;
  override apiEndpoint = '/transactions/save-pair';
  override dependentChildTransactionType = ScheduleBTransactionTypes.PAC_CONDUIT_EARMARK_OUT;
  override navigationControls: TransactionNavigationControls = STANDARD_DOUBLE_ENTRY_CONTROLS;

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA11AI',
      transaction_type_identifier: ScheduleATransactionTypes.PAC_CONDUIT_EARMARK,
    });
  }
}
