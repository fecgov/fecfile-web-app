import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/OFFSET_TO_OPERATING_EXPENDITURES';
import { SchATransactionType } from '../transaction/schedule-a/scha-transaction-type.model';
import { SchATransaction } from '../transaction/schedule-a/scha-transaction.model';
import { STANDARD_CONTROLS, TransactionNavigationControls } from '../transaction/transaction-navigation-controls.model';
import {
  INDIVIDUAL_ORGANIZATION_FORM_FIELDS,
  ORGANIZATION_INDIVIDUAL_COMMITTEE,
} from 'app/shared/utils/transaction-type-properties';
import { AggregationGroups } from '../transaction/agregation-groups.model';
import {
  ScheduleATransactionTypeLabels,
  ScheduleATransactionTypes,
} from '../transaction/schedule-a/schedule-a-transaction-types.model';

export class OFFSET_TO_OPERATING_EXPENDITURES extends SchATransactionType {
  formFields = INDIVIDUAL_ORGANIZATION_FORM_FIELDS;
  contactTypeOptions = ORGANIZATION_INDIVIDUAL_COMMITTEE;
  title = LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.OFFSET_TO_OPERATING_EXPENDITURES);
  schema = schema;
  override navigationControls: TransactionNavigationControls = STANDARD_CONTROLS;

  override get isReattributable(): boolean {
    return false;
  }

  override get isCloneableTransactionType(): boolean {
    return true;
  }

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA15',
      transaction_type_identifier: ScheduleATransactionTypes.OFFSET_TO_OPERATING_EXPENDITURES,
      aggregation_group: AggregationGroups.LINE_15,
    });
  }
}
