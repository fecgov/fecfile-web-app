import { schema } from 'fecfile-validate/fecfile_validate_js/dist/CONDUIT_EARMARK_OUTS';
import { SchBTransaction } from '../schb-transaction.model';
import { TransactionGroupAG } from '../transaction-groups/transaction-group-ag.model';
import { AggregationGroups } from '../transaction.model';
import { ScheduleBTransactionTypes } from '../schb-transaction.model';
import { SchBTransactionType } from '../schb-transaction-type.model';
import { TemplateMapKeyType } from '../transaction-type.model';
import { ContactTypes } from '../contact.model';
import { SchATransaction } from '../scha-transaction.model';

export class CONDUIT_EARMARK_OUT_DEPOSITED extends SchBTransactionType {
  transactionGroup = new TransactionGroupAG();
  title = 'Conduit Earmark Receipt';
  schema = schema;
  override isDependentChild = true;
  override parentTriggerFields = ['organization_name', 'last_name', 'first_name'] as TemplateMapKeyType[];
  override inherittedFields = ['amount' as TemplateMapKeyType];
  override memoCodeMap = {
    true: 'Undeposited',
    false: 'Deposited',
  };

  override generatePurposeDescription(transaction: SchBTransaction): string {
    if (!transaction.parent_transaction) return '';
    const earmark: SchATransaction = transaction.parent_transaction as SchATransaction;
    let conduit = '';
    if (earmark.contributor_organization_name) {
      conduit = earmark.contributor_organization_name;
    }
    if (
      earmark.entity_type === ContactTypes.INDIVIDUAL &&
      earmark.contributor_first_name &&
      earmark.contributor_last_name
    ) {
      conduit = `${earmark.contributor_first_name || ''} ${earmark.contributor_last_name || ''}`;
    }
    if (conduit) {
      return `Earmarked from ${conduit} (Individual)`;
    }
    return '';
  }

  getNewTransaction() {
    return SchBTransaction.fromJSON({
      form_type: 'SA11AI',
      transaction_type_identifier: ScheduleBTransactionTypes.CONDUIT_EARMARK_OUT_DEPOSITED,
      aggregation_group: AggregationGroups.NONE,
    });
  }
}
