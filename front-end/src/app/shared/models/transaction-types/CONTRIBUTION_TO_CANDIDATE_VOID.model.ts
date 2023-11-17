import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/CANDIDATE_CONTRIBUTIONS';
import { SchBTransactionType } from '../schb-transaction-type.model';
import { SchBTransaction, ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { STANDARD_CONTROLS, TransactionNavigationControls } from '../transaction-navigation-controls.model';
import { PurposeDescriptionLabelSuffix } from '../transaction-type.model';
import {
  COMMITTEE,
  COMMITTEE_WITH_CANDIDATE_AND_ELECTION_B_FORM_FIELDS,
} from 'app/shared/utils/transaction-type-properties';
import { STANDARD_AND_CANDIDATE } from '../contact.model';

export class CONTRIBUTION_TO_CANDIDATE_VOID extends SchBTransactionType {
  formFields = COMMITTEE_WITH_CANDIDATE_AND_ELECTION_B_FORM_FIELDS;
  contactTypeOptions = COMMITTEE;
  override contactConfig = STANDARD_AND_CANDIDATE;
  title = LabelUtils.get(ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes.CONTRIBUTION_TO_CANDIDATE_VOID);
  schema = schema;
  override negativeAmountValueOnly = true;
  override hasCandidateCommittee = true;
  override purposeDescriptionLabelSuffix = PurposeDescriptionLabelSuffix.REQUIRED;
  override navigationControls: TransactionNavigationControls = STANDARD_CONTROLS;
  override contact2IsRequired = () => true;

  getNewTransaction(properties = {}) {
    return SchBTransaction.fromJSON({
      ...{
        form_type: 'SB23',
        transaction_type_identifier: ScheduleBTransactionTypes.CONTRIBUTION_TO_CANDIDATE_VOID,
      },
      ...properties,
    });
  }
}
