import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/NON_CONTRIBUTION_ACCOUNT_REFUNDS';
import { AggregationGroups } from '../transaction.model';
import { SchATransaction, ScheduleATransactionTypeLabels, ScheduleATransactionTypes } from '../scha-transaction.model';
import { SchATransactionType } from '../scha-transaction-type.model';
import { TransactionNavigationControls, STANDARD_PARENT_CONTROLS } from '../transaction-navigation-controls.model';
import { ContactTypes } from '../contact.model';
import { SubTransactionGroup } from '../transaction-type.model';

export class PARTNERSHIP_JF_TRANSFER_MEMO extends SchATransactionType {
  componentGroupId = 'D';
  title = LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.PARTNERSHIP_JF_TRANSFER_MEMO);
  schema = schema;
  override shortName = 'Partnership';
  override contactTypeOptions = [ContactTypes.ORGANIZATION];
  override navigationControls: TransactionNavigationControls = STANDARD_PARENT_CONTROLS;

  override subTransactionConfig = new SubTransactionGroup('Partnership Receipt JF Transfer Memo', []);

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA12',
      transaction_type_identifier: ScheduleATransactionTypes.PARTNERSHIP_JF_TRANSFER_MEMO,
      aggregation_group: AggregationGroups.GENERAL,
    });
  }

  override generatePurposeDescription(): string {
    return 'Non-contribution Account Refund';
  }
}
