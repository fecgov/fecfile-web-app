import { schema } from 'fecfile-validate/fecfile_validate_js/dist/CONDUIT_EARMARK_OUTS';
import { SchBTransactionType } from '../schb-transaction-type.model';
import { SchBTransaction, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { TransactionGroupPM } from '../transaction-groups/transaction-group-pm.model';
import { TemplateMapKeyType } from '../transaction-type.model';
import { SchATransaction } from '../scha-transaction.model';
import { GROUP_M } from 'app/shared/utils/transaction-type-properties';
import { CONDUIT_EARMARK_OUT, LabelConfig } from 'app/shared/utils/transaction-type-labels.utils';

export class PAC_CONDUIT_EARMARK_OUT extends SchBTransactionType {
  transactionGroup = new TransactionGroupPM();
  formProperties = GROUP_M;
  override labelConfig = CONDUIT_EARMARK_OUT;
  title = 'PAC Conduit Earmark Out';
  schema = schema;
  override isDependentChild = true;
  override parentTriggerFields = ['organization_name'] as TemplateMapKeyType[];
  override inheritedFields = ['amount', 'memo_code'] as TemplateMapKeyType[];
  override showAggregate = false;
  override memoCodeTransactionTypes = {
    true: ScheduleBTransactionTypes.PAC_CONDUIT_EARMARK_OUT_UNDEPOSITED,
    false: ScheduleBTransactionTypes.PAC_CONDUIT_EARMARK_OUT_DEPOSITED,
  };

  override generatePurposeDescription(transaction: SchBTransaction): string {
    if (!transaction.parent_transaction) return '';
    const earmark: SchATransaction = transaction.parent_transaction as SchATransaction;
    const conduit = earmark.contributor_organization_name;
    if (conduit) {
      return `Earmarked from ${conduit} (Committee)`;
    }
    return '';
  }
  getNewTransaction() {
    return SchBTransaction.fromJSON({
      form_type: 'SB23',
      transaction_type_identifier: ScheduleBTransactionTypes.PAC_CONDUIT_EARMARK_OUT,
    });
  }
}
