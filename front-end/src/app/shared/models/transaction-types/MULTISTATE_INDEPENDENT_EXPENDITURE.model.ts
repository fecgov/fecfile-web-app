import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/MULTISTATE_INDEPENDENT_EXPENDITURE';
import { SchETransactionType } from '../sche-transaction-type.model';
import { SchETransaction, ScheduleETransactionTypeLabels, ScheduleETransactionTypes } from '../sche-transaction.model';
import { STANDARD_CONTROLS, TransactionNavigationControls } from '../transaction-navigation-controls.model';
import {
  ORGANIZATION_INDIVIDUAL,
  ORG_FIELDS,
  INDIVIDUAL_FIELDS,
  ADDRESS_FIELDS,
  ELECTION_FIELDS,
  COMMON_FIELDS,
  CATEGORY_CODE,
  SIGNATORY_1_FIELDS,
  AGGREGATE,
  CANDIDATE_FIELDS,
  CANDIDATE_OFFICE_FIELDS,
} from 'app/shared/utils/transaction-type-properties';
import { STANDARD_AND_CANDIDATE } from '../contact.model';
import { AggregationGroups } from '../transaction.model';

export class MULTISTATE_INDEPENDENT_EXPENDITURE extends SchETransactionType {
  formFields = [
    ...ORG_FIELDS,
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
  contactTypeOptions = ORGANIZATION_INDIVIDUAL;
  override contactConfig = STANDARD_AND_CANDIDATE;
  title = LabelUtils.get(ScheduleETransactionTypeLabels, ScheduleETransactionTypes.MULTISTATE_INDEPENDENT_EXPENDITURE);
  schema = schema;
  override navigationControls: TransactionNavigationControls = STANDARD_CONTROLS;
  override contact2IsRequired = () => true;
  override showCalendarYTD = true;
  override memoTextRequired = true;
  override memoTextPrefix =
    'Multistate independent expenditure, publicly distributed or disseminated in the following states: ';
  override mandatoryFormValues = {
    [this.templateMap.candidate_office]: 'P',
    electionType: 'P',
  };

  getNewTransaction() {
    return SchETransaction.fromJSON({
      form_type: 'SE',
      transaction_type_identifier: ScheduleETransactionTypes.MULTISTATE_INDEPENDENT_EXPENDITURE,
      aggregation_group: AggregationGroups.INDEPENDENT_EXPENDITURE,
    });
  }
}
