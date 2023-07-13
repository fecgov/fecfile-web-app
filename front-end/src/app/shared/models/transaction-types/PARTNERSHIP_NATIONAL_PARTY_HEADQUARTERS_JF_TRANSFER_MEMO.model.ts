import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/PARTNERSHIP_NATIONAL_PARTY_HEADQUARTERS_JF_TRANSFER_MEMO';
import { AggregationGroups } from '../transaction.model';
import { SchATransaction, ScheduleATransactionTypeLabels, ScheduleATransactionTypes } from '../scha-transaction.model';
import { SchATransactionType } from '../scha-transaction-type.model';
import { TransactionNavigationControls, STANDARD_PARENT_CONTROLS } from '../transaction-navigation-controls.model';
import { ContactTypes } from '../contact.model';
import { SubTransactionGroup } from '../transaction-type.model';
import { TransactionGroupD } from '../transaction-groups/transaction-group-d.model';
import { GROUP_D } from 'app/shared/utils/transaction-type-properties';

export class PARTNERSHIP_NATIONAL_PARTY_HEADQUARTERS_JF_TRANSFER_MEMO extends SchATransactionType {
  transactionGroup = new TransactionGroupD();
  formProperties = GROUP_D;
  title = LabelUtils.get(
    ScheduleATransactionTypeLabels,
    ScheduleATransactionTypes.PARTNERSHIP_NATIONAL_PARTY_HEADQUARTERS_JF_TRANSFER_MEMO
  );
  schema = schema;
  override shortName = 'Partnership Receipt';
  override navigationControls: TransactionNavigationControls = STANDARD_PARENT_CONTROLS;

  override subTransactionConfig = new SubTransactionGroup(
    'PARTNERSHIP RECEIPT HEADQUARTERS BUILDINGS ACCOUNT JF TRANSFER MEMO',
    [ScheduleATransactionTypes.PARTNERSHIP_ATTRIBUTION_NATIONAL_PARTY_HEADQUARTERS_JF_TRANSFER_MEMO]
  );

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA17',
      transaction_type_identifier: ScheduleATransactionTypes.PARTNERSHIP_NATIONAL_PARTY_HEADQUARTERS_JF_TRANSFER_MEMO,
      aggregation_group: AggregationGroups.NATIONAL_PARTY_HEADQUARTERS_ACCOUNT,
    });
  }

  override generatePurposeDescription(transaction: SchATransaction): string {
    let committeeClause = `Headquarters Buildings Account JF Memo: ${
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
    'If transaction has no associated Partnership memos, reads "Headquarters Buildings Account JF Memo: XX (Partnership attributions do not require itemization)". Otherwise, reads "Headquarters Buildings Account JF Memo: XX (See Partnership Attribution(s) below)"';
}
