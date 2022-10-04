import { TransactionType } from '../../interfaces/transaction-type.interface';
import { SchATransaction, ScheduleATransactionTypes, ScheduleATransactionTypeLabels } from '../scha-transaction.model';
import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/OFFSET_TO_OPEX';

export class OFFSET_TO_OPEX implements TransactionType {
  scheduleId = 'A';
  componentGroupId = 'B';
  title = LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.OFFSETS_TO_OPERATING_EXPENDITURES);
  schema = schema;
  transaction = undefined;
  contact = undefined;
  parentTransaction = undefined;
  childTransactionType = undefined;

  contributionPurposeDescripReadonly(): string {
    return '';
  }

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA15',
      transaction_type_identifier: ScheduleATransactionTypes.OFFSETS_TO_OPERATING_EXPENDITURES,
    });
  }
}
