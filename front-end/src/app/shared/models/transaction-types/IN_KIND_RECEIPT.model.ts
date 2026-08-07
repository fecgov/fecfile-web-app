import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/IN_KIND_RECEIPT';
import { IN_KIND } from './common-types/IN_KIND.model';
import { SchATransaction } from '../transaction/schedule-a/scha-transaction.model';
import {
  STANDARD_DOUBLE_ENTRY_CONTROLS,
  TransactionNavigationControls,
} from '../transaction/transaction-navigation-controls.model';
import { INDIVIDUAL_FORM_FIELDS, INDIVIDUAL } from 'app/shared/utils/transaction-type-properties';
import { AggregationGroups } from '../transaction/agregation-groups.model';
import {
  ScheduleATransactionTypeLabels,
  ScheduleATransactionTypes,
} from '../transaction/schedule-a/schedule-a-transaction-types.model';
import { ScheduleBTransactionTypes } from '../transaction/schedule-b/schedule-b-transaction-types.model';

export class IN_KIND_RECEIPT extends IN_KIND {
  override formFields = INDIVIDUAL_FORM_FIELDS;
  override contactTypeOptions = INDIVIDUAL;
  title = LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.IN_KIND_RECEIPT);
  schema = schema;
  override dependentChildTransactionTypes = [ScheduleBTransactionTypes.IN_KIND_OUT];
  override navigationControls: TransactionNavigationControls = STANDARD_DOUBLE_ENTRY_CONTROLS;

  override get isReattributable(): boolean {
    return false;
  }

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA11AI',
      transaction_type_identifier: ScheduleATransactionTypes.IN_KIND_RECEIPT,
      aggregation_group: AggregationGroups.GENERAL,
    });
  }
}
