import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/DEBTS';
import { SchDTransactionType } from '../schd-transaction-type.model';
import { SchDTransaction, ScheduleDTransactionTypeLabels, ScheduleDTransactionTypes } from '../schd-transaction.model';
import { STANDARD_CONTROLS, TransactionNavigationControls } from '../transaction-navigation-controls.model';
import {
  COMMITTEE_ORGANIZATION_INDIVIDUAL,
  ORG_FIELDS,
  INDIVIDUAL_FIELDS,
  ADDRESS_FIELDS,
} from 'app/shared/utils/transaction-type-properties';

export class DEBT_OWED_TO_COMMITTEE extends SchDTransactionType {
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
  contactTypeOptions = COMMITTEE_ORGANIZATION_INDIVIDUAL;
  title = LabelUtils.get(ScheduleDTransactionTypeLabels, ScheduleDTransactionTypes.DEBT_OWED_TO_COMMITTEE);
  schema = schema;
  override navigationControls: TransactionNavigationControls = STANDARD_CONTROLS;
  override hasAmountInput = false;
  override hasDebtInput = true;

  getNewTransaction(properties = {}) {
    return SchDTransaction.fromJSON({
      ...{
        form_type: 'SD9',
        transaction_type_identifier: ScheduleDTransactionTypes.DEBT_OWED_TO_COMMITTEE,
      },
      ...properties,
    });
  }
}
