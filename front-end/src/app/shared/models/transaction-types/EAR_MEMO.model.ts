import { TransactionType } from '../../interfaces/transaction-type.interface';
import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/EAR_MEMO';

export class EAR_MEMO implements TransactionType {
  scheduleId = 'A';
  componentGroupId = 'AG';
  title = '';
  schema = schema;
  transaction = undefined;
  parentTransaction = undefined;
  childTransactionType = undefined;

  contributionPurposeDescripReadonly(): string {
    return '';
  }

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA11AI',
      transaction_type_identifier: ScheduleATransactionTypes.EARMARK_MEMO,
      memo_code: true,
    });
  }
}
