import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/PARTNERSHIP_NATIONAL_PARTY_CONVENTION_JF_TRANSFER_MEMO';
import { SchATransaction, ScheduleATransactionTypeLabels, ScheduleATransactionTypes } from '../scha-transaction.model';
import { STANDARD_PARENT_CONTROLS, TransactionNavigationControls } from '../transaction-navigation-controls.model';
import { SubTransactionGroup } from '../transaction-type.model';
import { AggregationGroups } from '../transaction.model';
import { ORGANIZATION_FORM_FIELDS, ORGANIZATION } from 'app/shared/utils/transaction-type-properties';
import { shortenClause } from '../clause';
import { SchAMemo } from './common-types/scha_memo.model';

export class PARTNERSHIP_NATIONAL_PARTY_CONVENTION_JF_TRANSFER_MEMO extends SchAMemo {
  formFields = ORGANIZATION_FORM_FIELDS;
  contactTypeOptions = ORGANIZATION;
  title = LabelUtils.get(
    ScheduleATransactionTypeLabels,
    ScheduleATransactionTypes.PARTNERSHIP_NATIONAL_PARTY_CONVENTION_JF_TRANSFER_MEMO,
  );
  schema = schema;
  override shortName = 'Partnership Receipt';
  override navigationControls: TransactionNavigationControls = STANDARD_PARENT_CONTROLS;

  override subTransactionConfig = new SubTransactionGroup(
    'Partnership Receipt Pres. Nominating Convention Account JF Transfer Memo',
    [ScheduleATransactionTypes.PARTNERSHIP_ATTRIBUTION_NATIONAL_PARTY_CONVENTION_JF_TRANSFER_MEMO],
  );

  override generatePurposeDescription(transaction: SchATransaction): string {
    const base = 'Pres. Nominating Convention Account JF Memo: ';
    const committeeName = (transaction.parent_transaction as SchATransaction).contributor_organization_name;
    const committeeClause = `${base}${committeeName}`;
    const hasChildren = transaction.children && transaction.children.length > 0;
    if (hasChildren) {
      const parenthetical = ' (See Partnership Attribution(s) below)';
      return shortenClause(committeeClause, parenthetical);
    }

    return shortenClause(committeeClause + ' (Partnership attributions do not meet itemization threshold)');
  }

  override purposeDescriptionLabelNotice =
    'If transaction has no associated Partnership memos, reads "Pres. Nominating Convention Account JF Memo: XX (Partnership attributions do not meet itemization threshold)". Otherwise, reads "Pres. Nominating Convention Account JF Memo: XX (See Partnership Attribution(s) below)"';

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA17',
      transaction_type_identifier: ScheduleATransactionTypes.PARTNERSHIP_NATIONAL_PARTY_CONVENTION_JF_TRANSFER_MEMO,
      aggregation_group: AggregationGroups.NATIONAL_PARTY_CONVENTION_ACCOUNT,
    });
  }
}
