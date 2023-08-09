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
import {
  CORE_FIELDS,
  ORG_FIELDS,
  ORGANIZATION,
  LOAN_FINANCE_FIELDS,
  LOAN_TERMS_FIELDS,
} from 'app/shared/utils/transaction-type-properties';
import { ScheduleC1TransactionTypes } from '../schc1-transaction.model';

export class LOAN_RECEIVED_FROM_BANK extends SchCTransactionType {
  override formFields = [...CORE_FIELDS, ...ORG_FIELDS, ...LOAN_FINANCE_FIELDS, ...LOAN_TERMS_FIELDS];
  contactTypeOptions = ORGANIZATION;
  override hasAmountInput = false;
  override doMemoCodeDateCheck = false;
  title = LabelUtils.get(ScheduleCTransactionTypeLabels, ScheduleCTransactionTypes.LOAN_RECEIVED_FROM_BANK);

  override description =
    'Follow this two-step process to create both a loan received from the bank and a loan agreement. This loan type requires an associated receipt.';
  override accordionTitle = 'STEP ONE';
  override accordionSubText = 'Enter lender, loan, and terms information for a loan received for a bank';
  override formTitle = undefined;
  override footer = 'Click STEP TWO below to enter loan agreement information.';
  override contactTitle = 'Lender';
  override contactLookupLabel = 'LENDER LOOKUP';

  schema = schema;
  override apiEndpoint = '/transactions/save';
  override dependentChildTransactionTypes = [
    ScheduleC1TransactionTypes.C1_LOAN_AGREEMENT,
    ScheduleATransactionTypes.LOAN_RECEIVED_FROM_BANK_RECEIPT,
  ];
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
      transaction_type_identifier: ScheduleCTransactionTypes.LOAN_RECEIVED_FROM_BANK,
      receipt_line_number: '13',
    });
  }
}
