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
import { ScheduleBTransactionTypes } from '../schb-transaction.model';
import {
  ADDRESS_FIELDS,
  COMMITTEE,
  COM_FIELDS_SHORT,
  LOAN_FINANCE_FIELDS,
  LOAN_TERMS_FIELDS,
} from 'app/shared/utils/transaction-type-properties';
import { ScheduleC2TransactionTypes } from '../schc2-transaction.model';

export class LOAN_BY_COMMITTEE extends SchCTransactionType {
  override formFields = [
    ...COM_FIELDS_SHORT,
    ...LOAN_FINANCE_FIELDS,
    ...LOAN_TERMS_FIELDS,
    ...ADDRESS_FIELDS,
    'date',
    'amount',
    'memo_code',
    'text4000',
  ];
  contactTypeOptions = COMMITTEE;
  override hasAmountInput = false;
  override doMemoCodeDateCheck = false;
  title = LabelUtils.get(ScheduleCTransactionTypeLabels, ScheduleCTransactionTypes.LOAN_BY_COMMITTEE);

  override description =
    'This loan type automatically creates an associated transaction. Saving a loan by committee will automatically create an associated disbursement.';
  override accordionTitle = 'ENTER DATA';
  override accordionSubText = 'Enter lendee, loan, and terms information for a loan by committee';
  override formTitle = undefined;
  override footer =
    'The information in this loan will automatically create a related disbursement. Review the disbursement; enter a purpose of disbursement or note/memo text; or continue without reviewing and “Save transactions.”';
  override contactTitle = 'Lendee';
  override contactLookupLabel = 'LENDEE LOOKUP';
  override showGuarantorTable = true;

  schema = schema;
  override apiEndpoint = '/transactions/save';
  override dependentChildTransactionTypes = [ScheduleBTransactionTypes.LOAN_MADE];
  override subTransactionConfig = [ScheduleC2TransactionTypes.C2_LOAN_GUARANTOR];
  override navigationControls: TransactionNavigationControls = new TransactionNavigationControls(
    [
      new NavigationControl(
        NavigationAction.SAVE,
        NavigationDestination.CHILD,
        'Save & add loan guarantor',
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
}
