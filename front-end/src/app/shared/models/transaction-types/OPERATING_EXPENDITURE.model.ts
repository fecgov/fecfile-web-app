import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/DISBURSEMENTS';
import { SchBTransactionType } from '../schb-transaction-type.model';
import { SchBTransaction, ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { STANDARD_CONTROLS, TransactionNavigationControls } from '../transaction-navigation-controls.model';
import { AggregationGroups } from '../transaction.model';
import { GROUP_B, ORGANIZATION_INDIVIDUAL_COMMITTEE } from 'app/shared/utils/transaction-type-properties';

export class OPERATING_EXPENDITURE extends SchBTransactionType {
  formFieldsConfig = GROUP_B;
  override contactTypeOptions = ORGANIZATION_INDIVIDUAL_COMMITTEE;
  title = LabelUtils.get(ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes.OPERATING_EXPENDITURE);
  schema = schema;
  override navigationControls: TransactionNavigationControls = STANDARD_CONTROLS;

  getNewTransaction() {
    return SchBTransaction.fromJSON({
      form_type: 'SB21B',
      transaction_type_identifier: ScheduleBTransactionTypes.OPERATING_EXPENDITURE,
      aggregation_group: AggregationGroups.GENERAL_DISBURSEMENT,
    });
  }
}
