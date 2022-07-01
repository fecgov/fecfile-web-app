import { TransactionType } from '../../interfaces/transaction-type.interface';
import { SchATransaction, ScheduleATransactionTypes, ScheduleATransactionTypeLabels } from '../scha-transaction.model';
import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/OTH_REC';

export class OTH_REC implements TransactionType {
  scheduleId = 'A';
  componentGroupId = 'C';
  title = LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.OTHER_RECEIPTS);
  schema = schema;
  transaction = null;
  parent = null;

  contributionPurposeDescripReadonly(): string {
    return '';
  }

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA17',
      transaction_type_identifier: ScheduleATransactionTypes.OTHER_RECEIPTS,
    });
  }
}
