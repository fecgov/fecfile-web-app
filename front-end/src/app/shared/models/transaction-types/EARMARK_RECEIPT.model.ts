import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/EARMARK_RECEIPT';
import { TransactionType } from '../../interfaces/transaction-type.interface';
import { AggregationGroups, SchATransaction, ScheduleATransactionTypeLabels, ScheduleATransactionTypes } from '../scha-transaction.model';

export class EARMARK_RECEIPT implements TransactionType {
  scheduleId = 'A';
  componentGroupId = 'AG';
  title = LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.EARMARK_RECEIPT);
  schema = schema;
  transaction: SchATransaction | undefined = undefined;
  contact = undefined;
  parent = undefined;

  contributionPurposeDescripReadonly(): string {
    return '';
  }

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA11AI',
      transaction_type_identifier: ScheduleATransactionTypes.EARMARK_RECEIPT,
      aggregation_group: AggregationGroups.GENERAL,
    });
  }
}
