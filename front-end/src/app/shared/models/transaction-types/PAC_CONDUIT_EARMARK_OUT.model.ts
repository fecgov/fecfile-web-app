import { schema } from 'fecfile-validate/fecfile_validate_js/dist/CONDUIT_EARMARK_OUTS';
import { SchBTransaction, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { TemplateMapKeyType } from '../transaction-type.model';
import { SchATransaction } from '../scha-transaction.model';
import {
  COMMITTEE,
  COMMITTEE_WITH_CANDIDATE_AND_ELECTION_B_FORM_FIELDS,
} from 'app/shared/utils/transaction-type-properties';
import { CONDUIT_EARMARK_OUT } from './common-types/CONDUIT_EARMARK_OUT.model';
import { STANDARD_AND_CANDIDATE } from '../contact.model';

export class PAC_CONDUIT_EARMARK_OUT extends CONDUIT_EARMARK_OUT {
  formFields = COMMITTEE_WITH_CANDIDATE_AND_ELECTION_B_FORM_FIELDS;
  contactTypeOptions = COMMITTEE;
  override contactConfig = STANDARD_AND_CANDIDATE;
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
      let conduitClause = `Earmarked from ${conduit}`;
      const parenthetical = ' (Committee)';
      if ((conduitClause + parenthetical).length > 100) {
        conduitClause = conduitClause.slice(0, 97 - parenthetical.length) + '...';
      }
      return conduitClause + parenthetical;
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
