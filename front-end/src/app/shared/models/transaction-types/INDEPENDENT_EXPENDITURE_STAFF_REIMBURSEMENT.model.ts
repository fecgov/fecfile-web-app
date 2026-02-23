import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/INDEPENDENT_EXPENDITURE_PARENTS';
import { SchETransactionType } from '../sche-transaction-type.model';
import { STANDARD_PARENT_CONTROLS, TransactionNavigationControls } from '../transaction-navigation-controls.model';
import {
  ADDRESS_FIELDS,
  ELECTION_FIELDS,
  COMMON_FIELDS,
  CATEGORY_CODE,
  SIGNATORY_1_FIELDS,
  AGGREGATE,
  CANDIDATE_FIELDS,
  CANDIDATE_OFFICE_FIELDS,
  INDIVIDUAL,
  INDIVIDUAL_FIELDS,
} from 'app/shared/utils/transaction-type-properties';
import { STANDARD_AND_CANDIDATE } from '../contact.model';
import { ScheduleETransactionTypeLabels, ScheduleETransactionTypes, AggregationGroups } from '../type-enums';

export class INDEPENDENT_EXPENDITURE_STAFF_REIMBURSEMENT extends SchETransactionType {
  formFields = [
    ...INDIVIDUAL_FIELDS,
    ...ADDRESS_FIELDS,
    ...CANDIDATE_FIELDS,
    ...CANDIDATE_OFFICE_FIELDS,
    ...ELECTION_FIELDS,
    ...COMMON_FIELDS,
    ...CATEGORY_CODE,
    ...SIGNATORY_1_FIELDS,
    ...AGGREGATE,
    'date2',
    'support_oppose_code',
    'calendar_ytd',
  ];
  contactTypeOptions = INDIVIDUAL;
  override contactConfig = STANDARD_AND_CANDIDATE;
  title = LabelUtils.get(
    ScheduleETransactionTypeLabels,
    ScheduleETransactionTypes.INDEPENDENT_EXPENDITURE_STAFF_REIMBURSEMENT,
  );
  schema = schema;
  override navigationControls: TransactionNavigationControls = STANDARD_PARENT_CONTROLS;
  override contact2IsRequired = () => true;
  override subTransactionConfig = [ScheduleETransactionTypes.INDEPENDENT_EXPENDITURE_STAFF_REIMBURSEMENT_MEMO];
  override showCalendarYTD = true;

  override generatePurposeDescription(): string {
    return 'Reimbursement: See Below';
  }

  override readonly initializationData = {
    form_type: 'SE',
    transaction_type_identifier: ScheduleETransactionTypes.INDEPENDENT_EXPENDITURE_STAFF_REIMBURSEMENT,
    aggregation_group: AggregationGroups.INDEPENDENT_EXPENDITURE,
  };
}
