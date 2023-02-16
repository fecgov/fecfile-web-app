import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/COMMON_DISBURSEMENTS';
import { AggregationGroups } from '../transaction.model';
import { SchBTransaction, ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { SchbTransactionType } from '../schb-transaction-type.model';
import { STANDARD_CONTROLS, TransactionNavigationControls } from '../transaction-navigation-controls.model';
import { ContactTypes } from '../contact.model';

export class OPERATING_EXPENDITURE extends SchbTransactionType {
  componentGroupId = 'H';
  title = LabelUtils.get(ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes.OPERATING_EXPENDITURE);
  schema = schema;
  override defaultContactTypeOption = ContactTypes.ORGANIZATION;
  override navigationControls: TransactionNavigationControls = STANDARD_CONTROLS;

  getNewTransaction() {
    return SchBTransaction.fromJSON({
      form_type: 'SB21b',
      transaction_type_identifier: ScheduleBTransactionTypes.OPERATING_EXPENDITURE,
      aggregation_group: AggregationGroups.GENERAL_DISBURSEMENT,
    });
  }
}
