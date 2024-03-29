import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/TRANSFER_TO_AFFILIATES';
import { SchBTransactionType } from '../schb-transaction-type.model';
import { SchBTransaction, ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { STANDARD_CONTROLS, TransactionNavigationControls } from '../transaction-navigation-controls.model';
import { COMMITTEE, COMMITTEE_B_FORM_FIELDS } from 'app/shared/utils/transaction-type-properties';

export class TRANSFER_TO_AFFILIATES extends SchBTransactionType {
  formFields = COMMITTEE_B_FORM_FIELDS;
  contactTypeOptions = COMMITTEE;
  title = LabelUtils.get(ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes.TRANSFER_TO_AFFILIATES);
  schema = schema;
  override navigationControls: TransactionNavigationControls = STANDARD_CONTROLS;

  getNewTransaction() {
    return SchBTransaction.fromJSON({
      form_type: 'SB22',
      transaction_type_identifier: ScheduleBTransactionTypes.TRANSFER_TO_AFFILIATES,
    });
  }
}
