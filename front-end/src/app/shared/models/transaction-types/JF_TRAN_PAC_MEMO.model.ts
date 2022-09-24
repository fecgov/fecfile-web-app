import { TransactionType } from '../../interfaces/transaction-type.interface';
import { SchATransaction, ScheduleATransactionTypes, ScheduleATransactionTypeLabels } from '../scha-transaction.model';
import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/JF_TRAN_PAC_MEMO';

export class JF_TRAN_PAC_MEMO implements TransactionType {
  scheduleId = 'A';
  componentGroupId = 'F';
  title = LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.JF_TRAN_PAC_MEMO);
  schema = schema;
  transaction = undefined;
  parentTransaction: SchATransaction | undefined = undefined;
  childTransactionType = undefined;

  contributionPurposeDescripReadonly(): string {
    return `JF Memo: ${this.parentTransaction?.contributor_organization_name}`;
  }

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA12',
      transaction_type_identifier: ScheduleATransactionTypes.JF_TRAN_PAC_MEMO,
      back_reference_sched_name: 'SA12',
    });
  }
}
