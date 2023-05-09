import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/NATIONAL_PARTY_EARMARK_RECEIPTS';
import { ContactTypes } from '../contact.model';
import { SchATransactionType } from '../scha-transaction-type.model';
import { SchATransaction, ScheduleATransactionTypeLabels, ScheduleATransactionTypes } from '../scha-transaction.model';
import { TransactionGroupAG } from '../transaction-groups/transaction-group-ag.model';
import { STANDARD_CONTROLS, TransactionNavigationControls } from '../transaction-navigation-controls.model';
import { AggregationGroups } from '../transaction.model';

export class EARMARK_RECEIPT_CONVENTION_ACCOUNT extends SchATransactionType {
  transactionGroup = new TransactionGroupAG();
  title = LabelUtils.get(
    ScheduleATransactionTypeLabels,
    ScheduleATransactionTypes.EARMARK_RECEIPT_FOR_CONVENTION_ACCOUNT_CONTRIBUTION
  );
  schema = schema;
  override dependentChildTransactionType = ScheduleATransactionTypes.EARMARK_MEMO_CONVENTION_ACCOUNT;
  override navigationControls: TransactionNavigationControls = STANDARD_CONTROLS;

  override generatePurposeDescription(transaction: SchATransaction): string {
    if (!transaction.children) return '';
    const subTransaction: SchATransaction = transaction.children[0] as SchATransaction;
    let conduit = subTransaction.contributor_organization_name || '';
    if (
      subTransaction.entity_type === ContactTypes.INDIVIDUAL &&
      subTransaction.contributor_first_name &&
      subTransaction.contributor_last_name
    ) {
      conduit = `${subTransaction.contributor_first_name || ''} ${subTransaction.contributor_last_name || ''}`;
    }
    if (conduit) {
      return `Pres. Nominating Convention Account - Earmarked Through ${conduit}`;
    }
    return '';
  }

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA17',
      transaction_type_identifier: ScheduleATransactionTypes.EARMARK_RECEIPT_FOR_CONVENTION_ACCOUNT_CONTRIBUTION,
      aggregation_group: AggregationGroups.NATIONAL_PARTY_CONVENTION_ACCOUNT,
    });
  }
}
