import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/LOANS';
import { SchCTransactionType } from '../transaction/schedule-c/schc-transaction-type.model';
import { SchCTransaction } from '../transaction/schedule-c/schc-transaction.model';
import {
  CANCEL_CONTROL,
  SAVE_TRIPLE_ENTRY_LIST_CONTROL,
  TransactionNavigationControls,
  NavigationControl,
  NavigationAction,
  NavigationDestination,
  ControlType,
} from '../transaction/transaction-navigation-controls.model';
import {
  COMMON_FIELDS,
  ADDRESS_FIELDS,
  ORG_FIELDS,
  ORGANIZATION,
  LOAN_FINANCE_FIELDS,
  LOAN_TERMS_FIELDS,
} from 'app/shared/utils/transaction-type-properties';
import { ScheduleATransactionTypes } from '../transaction/schedule-a/schedule-a-transaction-types.model';
import {
  ScheduleCTransactionTypeLabels,
  ScheduleCTransactionTypes,
} from '../transaction/schedule-c/schedule-c-transaction-types.model';
import { ScheduleC1TransactionTypes } from '../transaction/schedule-c1/schedule-c1-transaction-types.model';
import { ScheduleC2TransactionTypes } from '../transaction/schedule-c2/schedule-c2-transaction-types.model';
import { hasNoContact } from '../transaction/transaction-model.utils';

export class LOAN_RECEIVED_FROM_BANK extends SchCTransactionType {
  override formFields = [
    ...COMMON_FIELDS,
    ...ADDRESS_FIELDS,
    ...ORG_FIELDS,
    ...LOAN_FINANCE_FIELDS,
    ...LOAN_TERMS_FIELDS,
  ];
  contactTypeOptions = ORGANIZATION;
  override hasAmountInput = false;
  override doMemoCodeDateCheck = false;
  title = LabelUtils.get(ScheduleCTransactionTypeLabels, ScheduleCTransactionTypes.LOAN_RECEIVED_FROM_BANK);

  override description =
    'Follow this multi-step process to create both a loan received from the bank and a loan agreement. This loan type automatically creates an associated transaction. Saving a loan received from bank will automatically create an associated disbursement.';
  override accordionTitle = 'STEP ONE';
  override accordionSubText = 'Enter lender, loan, and terms information for a loan received for a bank';
  override formTitle = 'Loan';
  override footer =
    'The information in this loan will automatically create a related disbursement. Review the disbursement; enter a purpose of disbursement or note/memo text; or continue without reviewing and "Save transactions."';
  override contactTitle = 'Lender';
  override showGuarantorTable = true;

  schema = schema;
  override dependentChildTransactionTypes = [
    ScheduleC1TransactionTypes.C1_LOAN_AGREEMENT,
    ScheduleATransactionTypes.LOAN_RECEIVED_FROM_BANK_RECEIPT,
  ];
  override subTransactionConfig = [ScheduleC2TransactionTypes.C2_LOAN_GUARANTOR];
  override navigationControls: TransactionNavigationControls = new TransactionNavigationControls(
    [
      new NavigationControl(
        NavigationAction.SAVE,
        NavigationDestination.CHILD,
        'Save & add loan guarantor',
        'add-button',
        hasNoContact,
        () => true,
        'pi pi-plus',
        ControlType.BUTTON,
      ),
    ],
    [CANCEL_CONTROL],
    [SAVE_TRIPLE_ENTRY_LIST_CONTROL],
  );

  getNewTransaction() {
    return SchCTransaction.fromJSON({
      form_type: 'SC/10',
      transaction_type_identifier: ScheduleCTransactionTypes.LOAN_RECEIVED_FROM_BANK,
      receipt_line_number: '13',
    });
  }
}
