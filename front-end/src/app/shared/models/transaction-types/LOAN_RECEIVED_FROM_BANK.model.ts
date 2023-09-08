import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/LOANS';
import { SchCTransactionType } from '../schc-transaction-type.model';
import { SchCTransaction, ScheduleCTransactionTypeLabels, ScheduleCTransactionTypes } from '../schc-transaction.model';
import {
  CANCEL_CONTROL,
  SAVE_TRIPLE_ENTRY_LIST_CONTROL,
  TransactionNavigationControls,
  NavigationControl,
  NavigationAction,
  NavigationDestination,
  ControlType,
} from '../transaction-navigation-controls.model';
import { hasNoContact } from '../transaction.model';
import { ScheduleATransactionTypes } from '../scha-transaction.model';
import {
  COMMON_FIELDS,
  ADDRESS_FIELDS,
  ORG_FIELDS,
  ORGANIZATION,
  LOAN_FINANCE_FIELDS,
  LOAN_TERMS_FIELDS,
} from 'app/shared/utils/transaction-type-properties';
import { ScheduleC1TransactionTypes } from '../schc1-transaction.model';
import { ScheduleC2TransactionTypes } from '../schc2-transaction.model';

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
    'Follow this multi-step process to create both a loan received from the bank and a loan agreement. This loan type automatically creates an associated transaction. Saving a loan received from bank will autmatically create an associated disbursement.';
  override accordionTitle = 'STEP ONE';
  override accordionSubText = 'Enter lender, loan, and terms information for a loan received for a bank';
  override formTitle = 'Loan';
  override footer =
    'The information in this loan will automatically create a related disbursement. Review the disbursement; enter a purpose of disbursement or note/memo text; or contiue without reviewing and "Save transactions."';
  override contactTitle = 'Lender';
  override contactLookupLabel = 'LENDER LOOKUP';
  override showGuarantorTable = true;

  schema = schema;
  override apiEndpoint = '/transactions/save';
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
        ControlType.BUTTON
      ),
    ],
    [CANCEL_CONTROL],
    [SAVE_TRIPLE_ENTRY_LIST_CONTROL]
  );

  getNewTransaction() {
    return SchCTransaction.fromJSON({
      form_type: 'SC/10',
      transaction_type_identifier: ScheduleCTransactionTypes.LOAN_RECEIVED_FROM_BANK,
      receipt_line_number: '13',
    });
  }
}
