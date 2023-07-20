import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/OFFSET_TO_OPERATING_EXPENDITURES';
import { SchATransactionType } from '../scha-transaction-type.model';
import { SchATransaction, ScheduleATransactionTypeLabels, ScheduleATransactionTypes } from '../scha-transaction.model';
import { STANDARD_CONTROLS, TransactionNavigationControls } from '../transaction-navigation-controls.model';
import { AggregationGroups } from '../transaction.model';
import { GROUP_B_FOR_A, ORGANIZATION_INDIVIDUAL_COMMITTEE } from 'app/shared/utils/transaction-type-properties';

export class OFFSET_TO_OPERATING_EXPENDITURES extends SchATransactionType {
  formFieldsConfig = GROUP_B_FOR_A;
  contactTypeOptions = ORGANIZATION_INDIVIDUAL_COMMITTEE;
  title = LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.OFFSET_TO_OPERATING_EXPENDITURES);
  schema = schema;
  override navigationControls: TransactionNavigationControls = STANDARD_CONTROLS;

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA15',
      transaction_type_identifier: ScheduleATransactionTypes.OFFSET_TO_OPERATING_EXPENDITURES,
      aggregation_group: AggregationGroups.LINE_15,
    });
  }
}
