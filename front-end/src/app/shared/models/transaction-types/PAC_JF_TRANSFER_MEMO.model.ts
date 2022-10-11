import { TransactionType } from '../../interfaces/transaction-type.interface';
import { SchATransaction, ScheduleATransactionTypes, ScheduleATransactionTypeLabels } from '../scha-transaction.model';
import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/PAC_JF_TRANSFER_MEMO';
import { Transaction } from '../../interfaces/transaction.interface';

export class PAC_JF_TRANSFER_MEMO implements TransactionType {
  scheduleId = 'A';
  componentGroupId = 'F';
  title = LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.PAC_JF_TRANSFER_MEMO);
  schema = schema;
  transaction: Transaction | undefined;
  contact = undefined;
  parent: SchATransaction | undefined;

  contributionPurposeDescripReadonly(): string {
    return `Joint Fundraising Memo: ${this.parent?.contributor_organization_name}`;
  }

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA12',
      transaction_type_identifier: ScheduleATransactionTypes.PAC_JF_TRANSFER_MEMO,
      back_reference_sched_name: 'SA12',
    });
  }
}
