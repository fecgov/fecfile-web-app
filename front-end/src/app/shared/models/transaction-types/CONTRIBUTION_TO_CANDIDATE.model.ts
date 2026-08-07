import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/CANDIDATE_CONTRIBUTIONS';
import { SchBTransactionType } from '../transaction/schedule-b/schb-transaction-type.model';
import { SchBTransaction } from '../transaction/schedule-b/schb-transaction.model';
import { STANDARD_CONTROLS, TransactionNavigationControls } from '../transaction/transaction-navigation-controls.model';
import {
  COMMITTEE,
  COMMITTEE_WITH_CANDIDATE_AND_ELECTION_B_FORM_FIELDS,
} from 'app/shared/utils/transaction-type-properties';
import { STANDARD_AND_CANDIDATE } from '../contacts/contact.model';
import {
  ScheduleBTransactionTypeLabels,
  ScheduleBTransactionTypes,
} from '../transaction/schedule-b/schedule-b-transaction-types.model';

export class CONTRIBUTION_TO_CANDIDATE extends SchBTransactionType {
  formFields = COMMITTEE_WITH_CANDIDATE_AND_ELECTION_B_FORM_FIELDS;
  contactTypeOptions = COMMITTEE;
  override contactConfig = STANDARD_AND_CANDIDATE;
  title = LabelUtils.get(ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes.CONTRIBUTION_TO_CANDIDATE);
  schema = schema;
  override hasCandidateCommittee = true;
  override navigationControls: TransactionNavigationControls = STANDARD_CONTROLS;
  override contact2IsRequired = () => true;

  override get isCloneableTransactionType(): boolean {
    return true;
  }

  getNewTransaction() {
    return SchBTransaction.fromJSON({
      form_type: 'SB23',
      transaction_type_identifier: ScheduleBTransactionTypes.CONTRIBUTION_TO_CANDIDATE,
    });
  }
}
