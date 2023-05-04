import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/PARTNERSHIP_JF_TRANSFER_MEMO';
import { AggregationGroups } from '../transaction.model';
import { SchATransaction, ScheduleATransactionTypeLabels, ScheduleATransactionTypes } from '../scha-transaction.model';
import { SchATransactionType } from '../scha-transaction-type.model';
import { TransactionNavigationControls, STANDARD_PARENT_CONTROLS } from '../transaction-navigation-controls.model';
import { ContactTypes } from '../contact.model';
import { SubTransactionGroup } from '../transaction-type.model';
import { TransactionGroupD } from '../transaction-groups/transaction-group-d';

export class PARTNERSHIP_JF_TRANSFER_MEMO extends SchATransactionType {
  
  transactionGroup = new TransactionGroupD();
  title = LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.PARTNERSHIP_JF_TRANSFER_MEMO);
  schema = schema;
  override shortName = 'Partnership Receipt';
  override contactTypeOptions = [ContactTypes.ORGANIZATION];
  override navigationControls: TransactionNavigationControls = STANDARD_PARENT_CONTROLS;

  override subTransactionConfig = new SubTransactionGroup('Partnership Receipt JF Transfer Memo', [
    ScheduleATransactionTypes.PARTNERSHIP_INDIVIDUAL_JF_TRANSFER_MEMO,
  ]);

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA12',
      transaction_type_identifier: ScheduleATransactionTypes.PARTNERSHIP_JF_TRANSFER_MEMO,
      aggregation_group: AggregationGroups.GENERAL,
    });
  }

  override generatePurposeDescription(transaction: SchATransaction): string {
    let committeeClause = `JF Memo: ${
      (transaction.parent_transaction as SchATransaction).contributor_organization_name
    }`;
    const hasChildren = transaction.children && transaction.children.length > 0;
    const parenthetical = hasChildren
      ? ' (See Partnership Attribution(s) below)'
      : ' (Partnership attributions do not require itemization)';
    if ((committeeClause + parenthetical).length > 100) {
      committeeClause = committeeClause.slice(0, 97 - parenthetical.length) + '...';
    }
    return committeeClause + parenthetical;
  }

  override purposeDescriptionLabelNotice =
    'If transaction has no associated Partnership memos, reads "JF Memo: XX (Partnership attributions do not require itemization)". Otherwise, reads "JF Memo: XX (See Partnership Attribution(s) below)"';
}
