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
import { ScheduleBTransactionTypes } from '../schb-transaction.model';
import { TransactionGroupYB } from '../transaction-groups/transaction-group-yb.model';

export class LOAN_BY_COMMITTEE extends SchCTransactionType {
  transactionGroup = new TransactionGroupYB();
  title = LabelUtils.get(ScheduleCTransactionTypeLabels, ScheduleCTransactionTypes.LOAN_BY_COMMITTEE);
  schema = schema;
  override apiEndpoint = '/transactions/save-pair';
  override dependentChildTransactionType = ScheduleBTransactionTypes.LOAN_MADE;
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
      form_type: 'SC/9',
      transaction_type_identifier: ScheduleCTransactionTypes.LOAN_BY_COMMITTEE,
      receipt_line_number: '27',
    });
  }

  /////////////////////////////////////////////////////////////////////
  // Template variables to be integrated with #1193
  override hasAmountInput = false;
  override hasLoanInfoInput = true;
  override hasLoanTermsInput = true;
  override contactHeaderLabel = 'Lendee';
  override contactDropdownLabel = 'LENDEE TYPE';
  override doMemoCodeDateCheck = false;
}
