import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/PARTNERSHIP_NATIONAL_PARTY_HEADQUARTERS_JF_TRANSFER_MEMO';
import { ContactTypes } from '../contact.model';
import { SchATransactionType } from '../scha-transaction-type.model';
import { SchATransaction, ScheduleATransactionTypeLabels, ScheduleATransactionTypes } from '../scha-transaction.model';
import { TransactionGroupD } from '../transaction-groups/transaction-group-d.model';
import { STANDARD_PARENT_CONTROLS, TransactionNavigationControls } from '../transaction-navigation-controls.model';
import { SubTransactionGroup } from '../transaction-type.model';
import { AggregationGroups } from '../transaction.model';

export class PARTNERSHIP_NATIONAL_PARTY_HEADQUARTERS_JF_TRANSFER_MEMO extends SchATransactionType {
  transactionGroup = new TransactionGroupD();
  title = LabelUtils.get(
    ScheduleATransactionTypeLabels,
    ScheduleATransactionTypes.PARTNERSHIP_NATIONAL_PARTY_HEADQUARTERS_JF_TRANSFER_MEMO
  );
  schema = schema;
  override shortName = 'Partnership Receipt';
  override contactTypeOptions = [ContactTypes.ORGANIZATION];
  override navigationControls: TransactionNavigationControls = STANDARD_PARENT_CONTROLS;

  override subTransactionConfig = new SubTransactionGroup(
    'PARTNERSHIP RECEIPT HEADQUARTERS BUILDINGS ACCOUNT JF TRANSFER MEMO',
    [ScheduleATransactionTypes.PARTNERSHIP_INDIVIDUAL_NATIONAL_PARTY_HEADQUARTERS_JF_TRANSFER_MEMO]
  );

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA17',
      transaction_type_identifier: ScheduleATransactionTypes.PARTNERSHIP_NATIONAL_PARTY_HEADQUARTERS_JF_TRANSFER_MEMO,
      aggregation_group: AggregationGroups.NATIONAL_PARTY_HEADQUARTERS_ACCOUNT,
    });
  }

  override generatePurposeDescription(transaction: SchATransaction): string {
    const committeeClause = `Headquarters Buildings Account JF Memo: ${
      (transaction.parent_transaction as SchATransaction).contributor_organization_name
    }`;
    const hasChildren = transaction.children && transaction.children.length > 0;
    const parenthetical = hasChildren
      ? ' (See Partnership Attribution(s) below)'
      : ' (Partnership attributions do not meet itemization threshold)';
    const purposeDescription = committeeClause + parenthetical;

    if (purposeDescription.length > 100) {
      return purposeDescription.slice(0, 97) + '...';
    }
    return purposeDescription;
  }

  override purposeDescriptionLabelNotice =
    'If transaction has no associated Partnership memos, reads "Headquarters Buildings Account JF Memo: XX (Partnership attributions do not meet itemization threshold)". Otherwise, reads "Headquarters Buildings Account JF Memo: XX (See Partnership Attribution(s) below)"';
}
