import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/DISBURSEMENTS';
import { AggregationGroups } from '../transaction.model';
import { SchBTransaction, ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { SchBTransactionType } from '../schb-transaction-type.model';
import { STANDARD_CONTROLS, TransactionNavigationControls } from '../transaction-navigation-controls.model';
import { ContactTypes } from '../contact.model';

export class OTHER_DISBURSEMENT_VOID extends SchBTransactionType {
  componentGroupId = 'B';
  title = LabelUtils.get(ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes.OTHER_DISBURSEMENT_VOID);
  schema = schema;
  override negativeAmountValueOnly = true;
  override defaultContactTypeOption = ContactTypes.ORGANIZATION;
  override navigationControls: TransactionNavigationControls = STANDARD_CONTROLS;

  getNewTransaction() {
    return SchBTransaction.fromJSON({
      form_type: 'SB29',
      transaction_type_identifier: ScheduleBTransactionTypes.OTHER_DISBURSEMENT_VOID,
      aggregation_group: AggregationGroups.GENERAL_DISBURSEMENT,
    });
  }
}
