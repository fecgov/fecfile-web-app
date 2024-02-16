import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/PARTNERSHIP_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO';
import { AggregationGroups } from '../transaction.model';
import { SchATransaction, ScheduleATransactionTypeLabels, ScheduleATransactionTypes } from '../scha-transaction.model';
import { SchATransactionType } from '../scha-transaction-type.model';
import { STANDARD_PARENT_CONTROLS, TransactionNavigationControls } from '../transaction-navigation-controls.model';
import { SubTransactionGroup } from '../transaction-type.model';
import { ORGANIZATION, ORGANIZATION_FORM_FIELDS } from 'app/shared/utils/transaction-type-properties';

export class PARTNERSHIP_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO extends SchATransactionType {
  formFields = ORGANIZATION_FORM_FIELDS;
  contactTypeOptions = ORGANIZATION;
  title = LabelUtils.get(
    ScheduleATransactionTypeLabels,
    ScheduleATransactionTypes.PARTNERSHIP_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO,
  );
  schema = schema;
  override shortName = 'Partnership Receipt';
  override navigationControls: TransactionNavigationControls = STANDARD_PARENT_CONTROLS;

  override subTransactionConfig = new SubTransactionGroup(
    'Partnership Receipt Recount/Legal Proceedings Account JF Transfer Memo',
    [ScheduleATransactionTypes.PARTNERSHIP_ATTRIBUTION_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO],
  );
  override purposeDescriptionLabelNotice =
    'If transaction has no associated Partnership memos, reads "Recount/Legal Proceedings Account JF Memo: XX (Partnership attributions do not meet itemization threshold)". Otherwise, reads "Recount/Legal Proceedings Account JF Memo: XX (See Partnership Attribution(s) below)"';

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA17',
      transaction_type_identifier: ScheduleATransactionTypes.PARTNERSHIP_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO,
      aggregation_group: AggregationGroups.NATIONAL_PARTY_RECOUNT_ACCOUNT,
    });
  }

  override generatePurposeDescription(transaction: SchATransaction): string {
    const committeeClause = `Recount/Legal Proceedings Account JF Memo: ${
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
}
