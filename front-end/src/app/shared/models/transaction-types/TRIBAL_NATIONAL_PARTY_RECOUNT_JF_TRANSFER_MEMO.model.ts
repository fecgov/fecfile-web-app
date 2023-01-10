import {
  SchATransaction,
  ScheduleATransactionTypes,
  ScheduleATransactionTypeLabels,
  AggregationGroups,
} from '../scha-transaction.model';
import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/TRIBAL_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO';
import { TransactionNavigationControls, JF_TRANSFER_MEMO_CONTROLS } from '../transaction-navigation-controls.model';
import { TransactionType } from 'app/shared/interfaces/transaction-type.interface';

export class TRIBAL_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO implements TransactionType {
  scheduleId = 'A';
  componentGroupId = 'D';
  isDependentChild = false;
  title = LabelUtils.get(
    ScheduleATransactionTypeLabels,
    ScheduleATransactionTypes.TRIBAL_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO
  );
  schema = schema;
  transaction?: SchATransaction;
  navigationControls: TransactionNavigationControls = JF_TRANSFER_MEMO_CONTROLS;

  generatePurposeDescription(): string {
    return `Recount/Legal Proceedings Account JF Memo: ${
      (this.transaction?.parent_transaction as SchATransaction)?.contributor_organization_name
    }`;
  }

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA17',
      transaction_type_identifier: ScheduleATransactionTypes.TRIBAL_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO,
      back_reference_sched_name: 'SA17',
      aggregation_group: AggregationGroups.NATIONAL_PARTY_RECOUNT_ACCOUNT,
    });
  }
}
