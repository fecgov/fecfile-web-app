import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/INDEPENDENT_EXPENDITURES';
import { SchETransactionType } from '../sche-transaction-type.model';
import { SchETransaction, ScheduleETransactionTypeLabels, ScheduleETransactionTypes } from '../sche-transaction.model';
import { STANDARD_CONTROLS, TransactionNavigationControls } from '../transaction-navigation-controls.model';
import { PurposeDescriptionLabelSuffix } from '../transaction-type.model';
import {
  ORGANIZATION_INDIVIDUAL,
  COMMITTEE_WITH_CANDIDATE_AND_ELECTION_B_FORM_FIELDS,
} from 'app/shared/utils/transaction-type-properties';
import { STANDARD_AND_CANDIDATE } from '../contact.model';

export class INDEPENDENT_EXPENDITURE_VOID extends SchETransactionType {
  formFields = COMMITTEE_WITH_CANDIDATE_AND_ELECTION_B_FORM_FIELDS;
  contactTypeOptions = ORGANIZATION_INDIVIDUAL;
  override contactConfig = STANDARD_AND_CANDIDATE;
  title = LabelUtils.get(ScheduleETransactionTypeLabels, ScheduleETransactionTypes.INDEPENDENT_EXPENDITURE_VOID);
  schema = schema;
  override negativeAmountValueOnly = true;
  override showAggregate = false;
  override hasCandidateCommittee = true;
  override purposeDescriptionLabelSuffix = PurposeDescriptionLabelSuffix.REQUIRED;
  override navigationControls: TransactionNavigationControls = STANDARD_CONTROLS;
  override contact2IsRequired = () => true;

  getNewTransaction() {
    return SchETransaction.fromJSON({
      form_type: 'SE',
      transaction_type_identifier: ScheduleETransactionTypes.INDEPENDENT_EXPENDITURE_VOID,
    });
  }
}
