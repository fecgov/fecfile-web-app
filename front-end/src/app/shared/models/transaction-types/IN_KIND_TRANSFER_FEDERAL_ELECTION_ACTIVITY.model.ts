import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/COM_IN_KIND_RECEIPTS';
import { SchATransaction, ScheduleATransactionTypeLabels, ScheduleATransactionTypes } from '../scha-transaction.model';
import { AggregationGroups } from '../transaction.model';
import { ScheduleBTransactionTypes } from '../schb-transaction.model';
import { IN_KIND } from './common-types/IN_KIND.model';

export class IN_KIND_TRANSFER_FEDERAL_ELECTION_ACTIVITY extends IN_KIND {
  title = LabelUtils.get(
    ScheduleATransactionTypeLabels,
    ScheduleATransactionTypes.IN_KIND_TRANSFER_FEDERAL_ELECTION_ACTIVITY,
  );
  schema = schema;
  override dependentChildTransactionTypes = [ScheduleBTransactionTypes.IN_KIND_TRANSFER_FEA_OUT];

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA12',
      transaction_type_identifier: ScheduleATransactionTypes.IN_KIND_TRANSFER_FEDERAL_ELECTION_ACTIVITY,
      aggregation_group: AggregationGroups.GENERAL,
    });
  }
}
