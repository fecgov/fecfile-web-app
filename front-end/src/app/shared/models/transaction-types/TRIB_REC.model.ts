import { TransactionType } from '../../interfaces/transaction-type.interface';
import { SchATransaction, ScheduleATransactionTypes, ScheduleATransactionTypeLabels } from '../scha-transaction.model';
import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/TRIB_REC';

export class TRIB_REC implements TransactionType {
  scheduleId = 'A';
  componentGroupId = 'D';
  title = LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.TRIBAL_RECEIPT);
  schema = schema;
  transaction = undefined;
  parent = undefined;

  contributionPurposeDescripReadonly(): string {
    return 'Tribal Receipt';
  }

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA11AI',
      transaction_type_identifier: ScheduleATransactionTypes.TRIBAL_RECEIPT,
    });
  }
}
