import { TransactionType } from '../../interfaces/transaction-type.interface';
import {
  SchATransaction,
  ScheduleATransactionTypes,
  ScheduleATransactionTypeLabels,
  AggregationGroups,
} from '../scha-transaction.model';
import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/PAC_JF_TRANSFER_MEMO';

export class PARTY_RECEIPT implements TransactionType {
  scheduleId = 'A';
  componentGroupId = 'F';
  isDependentChild = false;
  title = LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.PARTY_RECEIPT);
  schema = schema;
  transaction = undefined;
  parentTransaction: SchATransaction | undefined = undefined;
  childTransactionType = undefined;

  contributionPurposeDescripReadonly(): string {
    return '';
  }

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA11B',
      transaction_type_identifier: ScheduleATransactionTypes.PARTY_RECEIPT,
      back_reference_sched_name: 'SA11B',
      aggregation_group: AggregationGroups.GENERAL,
    });
  }
}
