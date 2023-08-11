import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/DISBURSEMENTS_FEA';
import { SchBTransactionType } from '../schb-transaction-type.model';
import { SchBTransaction, ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { STANDARD_CONTROLS, TransactionNavigationControls } from '../transaction-navigation-controls.model';
import { PurposeDescriptionLabelSuffix } from '../transaction-type.model';
import { AggregationGroups } from '../transaction.model';
import {
  INDIVIDUAL_ORGANIZATION_CANDIDATE_B_FORM_FIELDS,
  ORGANIZATION_INDIVIDUAL_COMMITTEE,
} from 'app/shared/utils/transaction-type-properties';
import { STANDARD_AND_CANDIDATE } from '../contact.model';

export class FEDERAL_ELECTION_ACTIVITY_VOID extends SchBTransactionType {
  formFields = INDIVIDUAL_ORGANIZATION_CANDIDATE_B_FORM_FIELDS;
  contactTypeOptions = ORGANIZATION_INDIVIDUAL_COMMITTEE;
  override contactConfig = STANDARD_AND_CANDIDATE;
  title = LabelUtils.get(ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes.FEDERAL_ELECTION_ACTIVITY_VOID);
  schema = schema;
  override negativeAmountValueOnly = true;
  override purposeDescriptionLabelSuffix = PurposeDescriptionLabelSuffix.REQUIRED;
  override navigationControls: TransactionNavigationControls = STANDARD_CONTROLS;

  getNewTransaction() {
    return SchBTransaction.fromJSON({
      form_type: 'SB30B',
      transaction_type_identifier: ScheduleBTransactionTypes.FEDERAL_ELECTION_ACTIVITY_VOID,
      aggregation_group: AggregationGroups.GENERAL_DISBURSEMENT,
    });
  }
}
