import { schema } from 'fecfile-validate/fecfile_validate_js/dist/CONDUIT_EARMARK_OUTS';
import { SchBTransaction, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { TemplateMapKeyType } from '../transaction-type.model';
import { ContactTypes, STANDARD_AND_CANDIDATE } from '../contact.model';
import { SchATransaction } from '../scha-transaction.model';
import {
  COMMITTEE,
  COMMITTEE_WITH_CANDIDATE_AND_ELECTION_B_FORM_FIELDS,
} from 'app/shared/utils/transaction-type-properties';
import { CONDUIT_EARMARK_OUT as CommonConduitEarmarkOut } from './common-types/CONDUIT_EARMARK_OUT.model';
import { conduitClause } from '../clause';

export class CONDUIT_EARMARK_OUT extends CommonConduitEarmarkOut {
  formFields = COMMITTEE_WITH_CANDIDATE_AND_ELECTION_B_FORM_FIELDS;
  contactTypeOptions = COMMITTEE;
  override contactConfig = STANDARD_AND_CANDIDATE;
  title = 'Conduit Earmark Out';
  schema = schema;
  override parentTriggerFields = ['organization_name', 'last_name', 'first_name'] as TemplateMapKeyType[];
  override memoCodeTransactionTypes = {
    true: ScheduleBTransactionTypes.CONDUIT_EARMARK_OUT_UNDEPOSITED,
    false: ScheduleBTransactionTypes.CONDUIT_EARMARK_OUT_DEPOSITED,
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
    return conduitClause(conduit, 'from');
  }

  getNewTransaction() {
    return SchBTransaction.fromJSON({
      form_type: 'SB23',
      transaction_type_identifier: ScheduleBTransactionTypes.CONDUIT_EARMARK_OUT,
    });
  }
}
