import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/LOANS';
import { SchCTransactionType } from '../schc-transaction-type.model';
import { SchCTransaction, ScheduleCTransactionTypeLabels, ScheduleCTransactionTypes } from '../schc-transaction.model';
import {
  CANCEL_CONTROL,
  SAVE_DOUBLE_ENTRY_LIST_CONTROL,
  TransactionNavigationControls,
  NavigationControl,
  NavigationAction,
  NavigationDestination,
} from '../transaction-navigation-controls.model';
import { hasNoContact } from '../transaction.model';
import { SubTransactionGroup } from '../transaction-type.model';
import { ScheduleATransactionTypes } from '../scha-transaction.model';
import { TransactionGroupZB } from '../transaction-groups/transaction-group-zb.model';

export class LOAN_RECEIVED_FROM_INDIVIDUAL extends SchCTransactionType {
  transactionGroup = new TransactionGroupZB();
  title = LabelUtils.get(ScheduleCTransactionTypeLabels, ScheduleCTransactionTypes.LOAN_RECEIVED_FROM_INDIVIDUAL);
  schema = schema;
  override apiEndpoint = '/transactions/save-pair';
  override dependentChildTransactionType = ScheduleATransactionTypes.LOAN_RECEIVED_FROM_INDIVIDUAL_RECEIPT;
  override subTransactionConfig = new SubTransactionGroup('Guarantors', []);
  override navigationControls: TransactionNavigationControls = new TransactionNavigationControls(
    [
      new NavigationControl(
        NavigationAction.SAVE,
        NavigationDestination.CHILD,
        'Add loan guarantor',
        'p-button-warning',
        hasNoContact,
        () => true,
        'pi pi-plus'
      ),
    ],
    [CANCEL_CONTROL],
    [SAVE_DOUBLE_ENTRY_LIST_CONTROL]
  );

  getNewTransaction() {
    return SchCTransaction.fromJSON({
      form_type: 'SC/10',
      transaction_type_identifier: ScheduleCTransactionTypes.LOAN_RECEIVED_FROM_INDIVIDUAL,
      receipt_line_number: '13',
    });
  }

  /////////////////////////////////////////////////////////////////////
  // Template variables to be integrated with #1193
  override hasAmountInput = false;
  override hasLoanInfoInput = true;
  override hasLoanTermsInput = true;
  override contactHeaderLabel = 'Lender';
  override contactDropdownLabel = 'LENDER LOOKUP';
}
