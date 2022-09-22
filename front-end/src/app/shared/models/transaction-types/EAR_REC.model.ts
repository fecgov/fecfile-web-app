import { TransactionType } from '../../interfaces/transaction-type.interface';
import { SchATransaction, ScheduleATransactionTypes, ScheduleATransactionTypeLabels } from '../scha-transaction.model';
import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/EAR_REC';

export class EAR_REC implements TransactionType {
  scheduleId = 'A';
  componentGroupId = 'AG';
  title = LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.EARMARK_RECEIPT);
  schema = schema;
  transaction = undefined;
  parent = undefined;

  contributionPurposeDescripReadonly(): string {
    return '';
  }

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA11AI',
      transaction_type_identifier: ScheduleATransactionTypes.EARMARK_RECEIPT,
    });
  }
}
