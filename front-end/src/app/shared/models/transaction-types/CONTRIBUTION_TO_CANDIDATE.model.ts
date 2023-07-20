import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/CANDIDATE_CONTRIBUTIONS';
import { SchBTransactionType } from '../schb-transaction-type.model';
import { SchBTransaction, ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { STANDARD_CONTROLS, TransactionNavigationControls } from '../transaction-navigation-controls.model';
import {
  COMMITTEE,
  COMMITTEE_WITH_CANDIDATE_AND_ELECTION_B_FORM_FIELDS,
} from 'app/shared/utils/transaction-type-properties';

export class CONTRIBUTION_TO_CANDIDATE extends SchBTransactionType {
  formFields = COMMITTEE_WITH_CANDIDATE_AND_ELECTION_B_FORM_FIELDS;
  contactTypeOptions = COMMITTEE;
  title = LabelUtils.get(ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes.CONTRIBUTION_TO_CANDIDATE);
  schema = schema;
  override showAggregate = false;
  override hasCandidateCommittee = true;
  override navigationControls: TransactionNavigationControls = STANDARD_CONTROLS;
  override contact2IsRequired = true;

  getNewTransaction() {
    return SchBTransaction.fromJSON({
      form_type: 'SB23',
      transaction_type_identifier: ScheduleBTransactionTypes.CONTRIBUTION_TO_CANDIDATE,
    });
  }
}
