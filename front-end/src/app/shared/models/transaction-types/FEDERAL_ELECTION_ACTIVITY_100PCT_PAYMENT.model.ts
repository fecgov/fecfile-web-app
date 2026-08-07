import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/DISBURSEMENTS_FEA';
import { SchBTransactionType } from '../transaction/schedule-b/schb-transaction-type.model';
import { SchBTransaction } from '../transaction/schedule-b/schb-transaction.model';
import { STANDARD_CONTROLS, TransactionNavigationControls } from '../transaction/transaction-navigation-controls.model';
import {
  INDIVIDUAL_ORGANIZATION_CANDIDATE_B_FORM_FIELDS,
  ORGANIZATION_INDIVIDUAL_COMMITTEE,
} from 'app/shared/utils/transaction-type-properties';
import { STANDARD_AND_CANDIDATE } from '../contacts/contact.model';
import { AggregationGroups } from '../transaction/agregation-groups.model';
import {
  ScheduleBTransactionTypeLabels,
  ScheduleBTransactionTypes,
} from '../transaction/schedule-b/schedule-b-transaction-types.model';

export class FEDERAL_ELECTION_ACTIVITY_100PCT_PAYMENT extends SchBTransactionType {
  formFields = INDIVIDUAL_ORGANIZATION_CANDIDATE_B_FORM_FIELDS;
  contactTypeOptions = ORGANIZATION_INDIVIDUAL_COMMITTEE;
  override contactConfig = STANDARD_AND_CANDIDATE;
  title = LabelUtils.get(
    ScheduleBTransactionTypeLabels,
    ScheduleBTransactionTypes.FEDERAL_ELECTION_ACTIVITY_100PCT_PAYMENT,
  );
  schema = schema;
  override navigationControls: TransactionNavigationControls = STANDARD_CONTROLS;

  override get isCloneableTransactionType(): boolean {
    return true;
  }

  getNewTransaction() {
    return SchBTransaction.fromJSON({
      form_type: 'SB30B',
      transaction_type_identifier: ScheduleBTransactionTypes.FEDERAL_ELECTION_ACTIVITY_100PCT_PAYMENT,
      aggregation_group: AggregationGroups.GENERAL_DISBURSEMENT,
    });
  }
}
