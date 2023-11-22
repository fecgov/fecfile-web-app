import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/DEBTS';
import { SchDTransactionType } from '../schd-transaction-type.model';
import { SchDTransaction, ScheduleDTransactionTypeLabels, ScheduleDTransactionTypes } from '../schd-transaction.model';
import { STANDARD_CONTROLS, TransactionNavigationControls } from '../transaction-navigation-controls.model';
import {
  ORG_FIELDS,
  INDIVIDUAL_FIELDS,
  ADDRESS_FIELDS,
  ORGANIZATION_INDIVIDUAL_COMMITTEE,
} from 'app/shared/utils/transaction-type-properties';

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
