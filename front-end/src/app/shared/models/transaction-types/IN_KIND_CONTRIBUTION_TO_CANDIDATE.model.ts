import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/IN_KIND_CONTRIBUTIONS';
import { SchBTransactionType } from '../schb-transaction-type.model';
import { SchBTransaction, ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { STANDARD_CONTROLS, TransactionNavigationControls } from '../transaction-navigation-controls.model';
import {
  ORGANIZATION_INDIVIDUAL,
  INDIVIDUAL_OR_ORGANIZATION_WITH_COMMITTEE_AND_CANDIDATE_AND_ELECTION_B_FORM_FIELDS,
} from 'app/shared/utils/transaction-type-properties';
import { STANDARD_AND_CANDIDATE_AND_SHORT_COMMITTEE } from '../contact.model';

export class IN_KIND_CONTRIBUTION_TO_CANDIDATE extends SchBTransactionType {
  formFields = INDIVIDUAL_OR_ORGANIZATION_WITH_COMMITTEE_AND_CANDIDATE_AND_ELECTION_B_FORM_FIELDS;
  contactTypeOptions = ORGANIZATION_INDIVIDUAL;
  override contactConfig = STANDARD_AND_CANDIDATE_AND_SHORT_COMMITTEE;
  title = LabelUtils.get(ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes.IN_KIND_CONTRIBUTION_TO_CANDIDATE);
  schema = schema;
  override navigationControls: TransactionNavigationControls = STANDARD_CONTROLS;
  override hasCandidateCommittee = true;
  override contact2IsRequired = () => true;
  override contact3IsRequired = true;
  override purposeDescriptionPrefix? = 'In-kind: ';
  override synchronizeOrgComNameValues = false;

  getNewTransaction() {
    return SchBTransaction.fromJSON({
      form_type: 'SB23',
      transaction_type_identifier: ScheduleBTransactionTypes.IN_KIND_CONTRIBUTION_TO_CANDIDATE,
    });
  }
}
