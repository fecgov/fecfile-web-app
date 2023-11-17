import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/OTHER_COMMITTEE_CONTRIBUTIONS';
import { SchBTransactionType } from '../schb-transaction-type.model';
import { SchBTransaction, ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { STANDARD_CONTROLS, TransactionNavigationControls } from '../transaction-navigation-controls.model';
import { PurposeDescriptionLabelSuffix } from '../transaction-type.model';
import { COMMITTEE, COMMITTEE_B_FORM_FIELDS } from 'app/shared/utils/transaction-type-properties';

export class CONTRIBUTION_TO_OTHER_COMMITTEE_VOID extends SchBTransactionType {
  formFields = COMMITTEE_B_FORM_FIELDS;
  contactTypeOptions = COMMITTEE;
  title = LabelUtils.get(
    ScheduleBTransactionTypeLabels,
    ScheduleBTransactionTypes.CONTRIBUTION_TO_OTHER_COMMITTEE_VOID
  );
  schema = schema;
  override isRefund = true;
  override navigationControls: TransactionNavigationControls = STANDARD_CONTROLS;
  override negativeAmountValueOnly = true;
  override purposeDescriptionLabelSuffix = PurposeDescriptionLabelSuffix.REQUIRED;

  getNewTransaction(properties = {}) {
    return SchBTransaction.fromJSON({
      ...{
        form_type: 'SB23',
        transaction_type_identifier: ScheduleBTransactionTypes.CONTRIBUTION_TO_OTHER_COMMITTEE_VOID,
      },
      ...properties,
    });
  }
}
