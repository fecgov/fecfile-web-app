import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/COM_IN_KIND_RECEIPTS';
import { SchATransaction } from '../transaction/schedule-a/scha-transaction.model';
import { IN_KIND } from './common-types/IN_KIND.model';
import { AggregationGroups } from '../transaction/agregation-groups.model';
import {
  ScheduleATransactionTypeLabels,
  ScheduleATransactionTypes,
} from '../transaction/schedule-a/schedule-a-transaction-types.model';
import { ScheduleBTransactionTypes } from '../transaction/schedule-b/schedule-b-transaction-types.model';

export class PAC_IN_KIND_RECEIPT extends IN_KIND {
  title = LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.PAC_IN_KIND_RECEIPT);
  schema = schema;
  override dependentChildTransactionTypes = [ScheduleBTransactionTypes.PAC_IN_KIND_OUT];

  override get isReattributable(): boolean {
    return false;
  }

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA11C',
      transaction_type_identifier: ScheduleATransactionTypes.PAC_IN_KIND_RECEIPT,
      aggregation_group: AggregationGroups.GENERAL,
    });
  }
}
