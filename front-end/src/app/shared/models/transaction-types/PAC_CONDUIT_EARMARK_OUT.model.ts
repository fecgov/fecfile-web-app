import { schema } from 'fecfile-validate/fecfile_validate_js/dist/CONDUIT_EARMARK_OUTS';
import { SchBTransactionType } from '../schb-transaction-type.model';
import { SchBTransaction, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { TemplateMapKeyType } from '../transaction-type.model';
import { SchATransaction } from '../scha-transaction.model';
import { GROUP_M } from 'app/shared/utils/transaction-type-properties';
import { CONDUIT_EARMARK_OUT } from './common-types/CONDUIT_EARMARK_OUT.model';

export class PAC_CONDUIT_EARMARK_OUT extends CONDUIT_EARMARK_OUT {
  formFieldsConfig = GROUP_M;
  title = 'PAC Conduit Earmark Out';
  schema = schema;
  override parentTriggerFields = ['organization_name'] as TemplateMapKeyType[];
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
