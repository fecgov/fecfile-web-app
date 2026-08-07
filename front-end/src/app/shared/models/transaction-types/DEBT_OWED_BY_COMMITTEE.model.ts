import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/DEBTS';
import { SchDTransactionType } from '../transaction/schedule-d/schd-transaction-type.model';
import { SchDTransaction } from '../transaction/schedule-d/schd-transaction.model';
import { STANDARD_CONTROLS, TransactionNavigationControls } from '../transaction/transaction-navigation-controls.model';
import {
  ORG_FIELDS,
  INDIVIDUAL_FIELDS,
  ADDRESS_FIELDS,
  ORGANIZATION_INDIVIDUAL_COMMITTEE,
} from 'app/shared/utils/transaction-type-properties';
import {
  ScheduleDTransactionTypeLabels,
  ScheduleDTransactionTypes,
} from '../transaction/schedule-d/schedule-d-transaction-types.model';

export class DEBT_OWED_BY_COMMITTEE extends SchDTransactionType {
  formFields = [
    ...ORG_FIELDS,
    ...INDIVIDUAL_FIELDS,
    ...ADDRESS_FIELDS,
    'amount',
    'balance',
    'purpose_description',
    // Fields specific to Schedule D and not in templateMap
    'payment_amount',
    'balance_at_close',
  ];
  contactTypeOptions = ORGANIZATION_INDIVIDUAL_COMMITTEE;
  title = LabelUtils.get(ScheduleDTransactionTypeLabels, ScheduleDTransactionTypes.DEBT_OWED_BY_COMMITTEE);
  schema = schema;
  override navigationControls: TransactionNavigationControls = STANDARD_CONTROLS;
  override hasAmountInput = false;
  override hasDebtInput = true;

  getNewTransaction() {
    return SchDTransaction.fromJSON({
      form_type: 'SD10',
      transaction_type_identifier: ScheduleDTransactionTypes.DEBT_OWED_BY_COMMITTEE,
    });
  }
}
