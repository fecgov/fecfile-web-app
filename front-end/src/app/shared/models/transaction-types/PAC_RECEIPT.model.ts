import { TransactionType } from '../../interfaces/transaction-type.interface';
import {
  SchATransaction,
  ScheduleATransactionTypes,
  ScheduleATransactionTypeLabels,
  AggregationGroups,
} from '../scha-transaction.model';
import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/PAC_RECEIPT';
import {
  CANCEL_CONTROL,
  SAVE_LIST_CONTROL,
  SAVE_ANOTHER_CONTROL,
  TransactionNavigationControls,
} from '../transaction-navigation-controls.model';

export class PAC_RECEIPT implements TransactionType {
  scheduleId = 'A';
  componentGroupId = 'F';
  isDependentChild = false;
  title = LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.PAC_RECEIPT);
  schema = schema;
  transaction = undefined;
  navigationControls?: TransactionNavigationControls = new TransactionNavigationControls(
    [],
    [CANCEL_CONTROL],
    [SAVE_LIST_CONTROL, SAVE_ANOTHER_CONTROL]
  );

  contributionPurposeDescripReadonly(): string {
    return '';
  }

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA11C',
      transaction_type_identifier: ScheduleATransactionTypes.PAC_RECEIPT,
      back_reference_sched_name: 'SA11C',
      aggregation_group: AggregationGroups.GENERAL,
    });
  }
}
