import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/AUTHORIZED_COMMITTEE_TRANSFER';
import { SchATransactionType } from '../scha-transaction-type.model';
import { SchATransaction, ScheduleATransactionTypeLabels, ScheduleATransactionTypes } from '../scha-transaction.model';
import { AggregationGroups } from '../transaction.model';
import {
  AGGREGATE,
  COMMITTEE,
  COMMITTEE_WITH_CANDIDATE_AND_ELECTION_B_FORM_FIELDS,
} from 'app/shared/utils/transaction-type-properties';
import { STANDARD_PARENT_CONTROLS } from '../transaction-navigation-controls.model';
import { STANDARD_AND_CANDIDATE } from '../contact.model';

export class AUTHORIZED_COMMITTEE_TRANSFER extends SchATransactionType {
  formFields = [...COMMITTEE_WITH_CANDIDATE_AND_ELECTION_B_FORM_FIELDS, ...AGGREGATE];
  contactTypeOptions = COMMITTEE;
  override contactConfig = STANDARD_AND_CANDIDATE;
  title = LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.AUTHORIZED_COMMITTEE_TRANSFER);
  schema = schema;
  override isCloneableTransactionType = true;
  override hasCandidateCommittee = true;
  override contact2IsRequired = () => true;

  override subTransactionConfig = [
    ScheduleATransactionTypes.INDIVIDUAL_AC_TRANSFER_MEMO,
    ScheduleATransactionTypes.PARTY_AC_TRANSFER_MEMO,
    ScheduleATransactionTypes.PAC_AC_TRANSFER_MEMO,
    ScheduleATransactionTypes.UNREGISTERED_ORGANIZATION_AC_TRANSFER_MEMO,
    ScheduleATransactionTypes.TRIBAL_AC_TRANSFER_MEMO,
    ScheduleATransactionTypes.PARTNERSHIP_AC_TRANSFER_MEMO,
    ScheduleATransactionTypes.PARTNERSHIP_ATTRIBUTION_AC_TRANSFER_MEMO,
  ];
  override _navigationControls = STANDARD_PARENT_CONTROLS;

  override generatePurposeDescription(): string {
    return 'Transfer from Authorized Committee';
  }

  getNewTransaction() {
    return SchATransaction.fromJSON({
      transaction_type_identifier: ScheduleATransactionTypes.AUTHORIZED_COMMITTEE_TRANSFER,
      aggregation_group: AggregationGroups.GENERAL,
    });
  }
}
