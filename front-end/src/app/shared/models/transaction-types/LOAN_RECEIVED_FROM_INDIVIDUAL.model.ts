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
  ControlType,
} from '../transaction-navigation-controls.model';
import { hasNoContact } from '../transaction.model';
import { ScheduleATransactionTypes } from '../scha-transaction.model';
import {
  COM_FIELDS,
  COMMON_FIELDS,
  ADDRESS_FIELDS,
  INDIVIDUAL_FIELDS,
  INDIVIDUAL_ORGANIZATION_COMMITTEE,
  LOAN_FINANCE_FIELDS,
  LOAN_TERMS_FIELDS,
} from 'app/shared/utils/transaction-type-properties';
import { ScheduleC2TransactionTypes } from '../schc2-transaction.model';

export class LOAN_RECEIVED_FROM_INDIVIDUAL extends SchCTransactionType {
  override formFields = [
    ...COMMON_FIELDS,
    ...ADDRESS_FIELDS,
    ...INDIVIDUAL_FIELDS,
    ...COM_FIELDS,
    ...LOAN_FINANCE_FIELDS,
    ...LOAN_TERMS_FIELDS,
  ];
  contactTypeOptions = INDIVIDUAL_ORGANIZATION_COMMITTEE;
  override hasAmountInput = false;
  override doMemoCodeDateCheck = false;
  title = LabelUtils.get(ScheduleCTransactionTypeLabels, ScheduleCTransactionTypes.LOAN_RECEIVED_FROM_INDIVIDUAL);

  override description = 'Saving a loan received from individual will automatically create a related receipt.';
  override accordionTitle = 'ENTER DATA';
  override accordionSubText = 'Enter lender, loan, and terms information for a loan received from individual';
  override formTitle = undefined;
  override footer =
    'The information in this loan will automatically create a related receipt. Review the receipt; enter a purpose of receipt or note/memo text; or continue without reviewing and “Save transactions.”';
  override contactTitle = 'Lender';
  override showGuarantorTable = true;

  schema = schema;
  override dependentChildTransactionTypes = [ScheduleATransactionTypes.LOAN_RECEIVED_FROM_INDIVIDUAL_RECEIPT];
  override subTransactionConfig = [ScheduleC2TransactionTypes.C2_LOAN_GUARANTOR];
  override navigationControls = new TransactionNavigationControls(
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
    [SAVE_DOUBLE_ENTRY_LIST_CONTROL]
  );

  getNewTransaction(properties = {}) {
    return SchCTransaction.fromJSON({
      ...{
        form_type: 'SC/10',
        transaction_type_identifier: ScheduleCTransactionTypes.LOAN_RECEIVED_FROM_INDIVIDUAL,
        receipt_line_number: '13',
      },
      ...properties,
    });
  }
}
