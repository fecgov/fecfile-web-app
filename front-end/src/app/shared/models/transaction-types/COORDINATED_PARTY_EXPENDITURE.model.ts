import { LabelUtils } from 'app/shared/utils/label.utils';
import {
  ADDRESS_FIELDS,
  AGGREGATE,
  CANDIDATE_FIELDS,
  CANDIDATE_OFFICE_FIELDS,
  CATEGORY_CODE,
  COMMON_FIELDS,
  COM_FIELDS,
  INDIVIDUAL_FIELDS,
  ORGANIZATION_INDIVIDUAL,
  ORG_FIELDS,
} from 'app/shared/utils/transaction-type-properties';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/COORDINATED_PARTY_EXPENDITURES';
import { STANDARD_AND_CANDIDATE } from '../contact.model';
import { SchFTransactionType } from '../schf-transaction-type.model';
import { SchFTransaction, ScheduleFTransactionTypeLabels, ScheduleFTransactionTypes } from '../schf-transaction.model';
import { STANDARD_CONTROLS, TransactionNavigationControls } from '../transaction-navigation-controls.model';
import { AggregationGroups } from '../transaction.model';

export class COORDINATED_PARTY_EXPENDITURE extends SchFTransactionType {
  formFields = [
    ...ORG_FIELDS,
    ...INDIVIDUAL_FIELDS,
    ...ADDRESS_FIELDS,
    ...COM_FIELDS,
    ...CANDIDATE_FIELDS,
    ...CANDIDATE_OFFICE_FIELDS,
    ...COMMON_FIELDS,
    'general_election_year',
    ...AGGREGATE,
    'filer_designated_to_make_coordinated_expenditures',
    ...COM_FIELDS,
    ...CATEGORY_CODE,
    'designating_committee_id_number',
    'designating_committee_name',
    'subordinate_committee_id_number',
    'subordinate_committee_name',
    'subordinate_street_1',
    'subordinate_street_2',
    'subordinate_city',
    'subordinate_state',
    'subordinate_zip',
  ];
  contactTypeOptions = ORGANIZATION_INDIVIDUAL;
  override contactConfig = STANDARD_AND_CANDIDATE;
  title = LabelUtils.get(ScheduleFTransactionTypeLabels, ScheduleFTransactionTypes.COORDINATED_PARTY_EXPENDITURE);
  schema = schema;
  override navigationControls: TransactionNavigationControls = STANDARD_CONTROLS;
  override contact2IsRequired = () => true;
  override aggregateLabel = 'AGGREGATE GENERAL ELECTION EXPENDITURE FOR THIS CANDIDATE';
  override showAggregate = true;
  override dateLabel = 'DATE';

  getNewTransaction() {
    return SchFTransaction.fromJSON({
      form_type: 'SF',
      transaction_type_identifier: ScheduleFTransactionTypes.COORDINATED_PARTY_EXPENDITURE,
      aggregation_group: AggregationGroups.COORDINATED_PARTY_EXPENDITURES,
    });
  }
}
