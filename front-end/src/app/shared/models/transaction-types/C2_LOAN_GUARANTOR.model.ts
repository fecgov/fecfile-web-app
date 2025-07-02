import { schema } from 'fecfile-validate/fecfile_validate_js/dist/C2_LOAN_GUARANTOR';
import {
  SchC2Transaction,
  ScheduleC2TransactionTypeLabels,
  ScheduleC2TransactionTypes,
} from '../schc2-transaction.model';
import { SchC2TransactionType } from '../schc2-transaction-type.model';
import {
  COM_FIELDS,
  ADDRESS_FIELDS,
  INDIVIDUAL_FIELDS,
  EMPLOYEE_INFO_FIELDS,
  INDIVIDUAL_COMMITTEE,
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
  ControlType,
} from '../transaction-navigation-controls.model';
import { hasNoContact } from '../transaction.model';
import { fecSpec8dot5Released } from 'app/shared/utils/schema.utils';

export class C2_LOAN_GUARANTOR extends SchC2TransactionType {
  readonly title = LabelUtils.get(ScheduleC2TransactionTypeLabels, ScheduleC2TransactionTypes.C2_LOAN_GUARANTOR);
  readonly formFields = [
    ...ADDRESS_FIELDS,
    ...INDIVIDUAL_FIELDS,
    'amount',
    ...EMPLOYEE_INFO_FIELDS,
    'entity_type',
    ...(fecSpec8dot5Released ? COM_FIELDS : []),
  ];

  override readonly contactConfig = STANDARD_SINGLE_CONTACT;
  override readonly navigationControls = new TransactionNavigationControls(
    [
      new NavigationControl(
        NavigationAction.SAVE,
        NavigationDestination.ANOTHER,
        'Save & add loan guarantor',
        'add-button',
        hasNoContact,
        () => true,
        'pi pi-plus',
        ControlType.BUTTON,
      ),
    ],
    [CANCEL_CONTROL],
    [SAVE_LIST_CONTROL],
  );
  readonly contactTypeOptions = fecSpec8dot5Released ? INDIVIDUAL_COMMITTEE : INDIVIDUAL;
  readonly schema = schema;
  override readonly hasAmountInput = true;
  override readonly hasAdditionalInfo = false;
  override readonly showAggregate = false;

  getNewTransaction() {
    return SchC2Transaction.fromJSON({
      form_type: 'SC2/10',
      transaction_type_identifier: ScheduleC2TransactionTypes.C2_LOAN_GUARANTOR,
    });
  }
}
