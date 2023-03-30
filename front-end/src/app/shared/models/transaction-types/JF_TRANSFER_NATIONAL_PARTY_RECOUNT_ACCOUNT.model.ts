import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/JF_TRANSFER_NATIONAL_PARTY_RECOUNT_ACCOUNT';
import { AggregationGroups } from '../transaction.model';
import { SchATransaction, ScheduleATransactionTypeLabels, ScheduleATransactionTypes } from '../scha-transaction.model';
import { SchATransactionType } from '../scha-transaction-type.model';
import {
  STANDARD_CONTROLS,
  STANDARD_PARENT_CONTROLS,
  TransactionNavigationControls,
} from '../transaction-navigation-controls.model';
import { SubTransactionsConfig } from '../transaction-type.model';

export class JF_TRANSFER_NATIONAL_PARTY_RECOUNT_ACCOUNT extends SchATransactionType {
  componentGroupId = 'E';
  title = LabelUtils.get(
    ScheduleATransactionTypeLabels,
    ScheduleATransactionTypes.JF_TRANSFER_NATIONAL_PARTY_RECOUNT_ACCOUNT
  );
  schema = schema;
  override subTransactionConfig = new SubTransactionsConfig(
    'Joint Fundraising Transfer - National Party Recount/Legal Proceedings Account Memo',
    [
      ScheduleATransactionTypes.PAC_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO,
      ScheduleATransactionTypes.INDIVIDUAL_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO,
      ScheduleATransactionTypes.TRIBAL_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO,
      ScheduleATransactionTypes.PARTNERSHIP_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO,
    ]
  );
  override navigationControls: TransactionNavigationControls = STANDARD_PARENT_CONTROLS;

  override generatePurposeDescription(): string {
    return 'Recount/Legal Proceedings Account Transfer of JF Proceeds';
  }

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA17',
      transaction_type_identifier: ScheduleATransactionTypes.JF_TRANSFER_NATIONAL_PARTY_RECOUNT_ACCOUNT,
      aggregation_group: AggregationGroups.NATIONAL_PARTY_RECOUNT_ACCOUNT,
    });
  }
}
