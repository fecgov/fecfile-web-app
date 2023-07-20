import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/COM_IN_KIND_RECEIPTS';
import { SchATransaction, ScheduleATransactionTypeLabels, ScheduleATransactionTypes } from '../scha-transaction.model';
import { AggregationGroups } from '../transaction.model';
import { ScheduleBTransactionTypes } from '../schb-transaction.model';
import { IN_KIND } from './common-types/IN_KIND.model';

export class PAC_IN_KIND_RECEIPT extends IN_KIND {
  title = LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.PAC_IN_KIND_RECEIPT);
  schema = schema;
  override dependentChildTransactionType = ScheduleBTransactionTypes.PAC_IN_KIND_OUT;

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA11C',
      transaction_type_identifier: ScheduleATransactionTypes.PAC_IN_KIND_RECEIPT,
      aggregation_group: AggregationGroups.GENERAL,
    });
  }
}
