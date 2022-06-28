import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/JF_TRAN';
import { TransactionType } from '../../interfaces/transaction-type.interface';
import { SchATransaction, ScheduleATransactionTypeLabels, ScheduleATransactionTypes } from '../scha-transaction.model';

export class JF_TRAN implements TransactionType {
  scheduleId = 'A';
  componentGroupId = 'E';
  title = LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.JF_TRANSFERS);
  schema = schema;
  transaction = null;

  contributionPurposeDescripReadonly(): string {
    return 'Transfer of JF Proceeds';
  }

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA12',
      transaction_type_identifier: ScheduleATransactionTypes.JF_TRANSFERS,
    });
  }
}
