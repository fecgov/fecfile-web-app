import { schema } from 'fecfile-validate/fecfile_validate_js/dist/C2_LOAN_GUARANTOR';
import {
  SchC2Transaction,
  ScheduleC2TransactionTypeLabels,
  ScheduleC2TransactionTypes,
} from '../schc2-transaction.model';
import { SchC2TransactionType } from '../schc2-transaction-type.model';
import {
  ADDRESS_FIELDS,
  INDIVIDUAL_FIELDS,
  EMPLOYEE_INFO_FIELDS,
  INDIVIDUAL,
} from 'app/shared/utils/transaction-type-properties';
import { STANDARD_SINGLE_CONTACT } from '../contact.model';
import { LabelUtils } from 'app/shared/utils/label.utils';
import {
  TransactionNavigationControls,
  NavigationControl,
  NavigationAction,
  NavigationDestination,
  CANCEL_CONTROL,
  SAVE_LIST_CONTROL,
} from '../transaction-navigation-controls.model';
import { hasNoContact } from '../transaction.model';

export class C2_LOAN_GUARANTOR extends SchC2TransactionType {
  title = LabelUtils.get(ScheduleC2TransactionTypeLabels, ScheduleC2TransactionTypes.C2_LOAN_GUARANTOR);
  formFields = [...ADDRESS_FIELDS, ...INDIVIDUAL_FIELDS, 'amount', ...EMPLOYEE_INFO_FIELDS];
  override contactConfig = STANDARD_SINGLE_CONTACT;
  override navigationControls = new TransactionNavigationControls(
    [
      new NavigationControl(
        NavigationAction.SAVE,
        NavigationDestination.ANOTHER_CHILD_BUTTON,
        'Save & add loan guarantor',
        'add-button',
        hasNoContact,
        () => true,
        'pi pi-plus'
      ),
    ],
    [CANCEL_CONTROL],
    [SAVE_LIST_CONTROL]
  );
  override contactTypeOptions = INDIVIDUAL;
  schema = schema;
  override hasAmountInput = true;
  override hasAdditionalInfo = false;
  override showAggregate = false;

  getNewTransaction() {
    return SchC2Transaction.fromJSON({
      form_type: 'SC2/10',
      transaction_type_identifier: ScheduleC2TransactionTypes.C2_LOAN_GUARANTOR,
    });
  }
}
