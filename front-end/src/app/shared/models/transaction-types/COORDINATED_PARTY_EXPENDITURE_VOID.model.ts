import { LabelUtils } from 'app/shared/utils/label.utils';
import {
  ADDRESS_FIELDS,
  CANDIDATE_FIELDS,
  CANDIDATE_OFFICE_FIELDS,
  CATEGORY_CODE,
  COMMON_FIELDS,
  COM_FIELDS_SHORT,
  INDIVIDUAL_FIELDS,
  ORGANIZATION_INDIVIDUAL,
  ORG_FIELDS,
  QUATERNARY_FIELDS,
  QUINARY_FIELDS,
} from 'app/shared/utils/transaction-type-properties';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/COORDINATED_PARTY_EXPENDITURES';
import { CONTACTS_ONE_THROUGH_FIVE } from '../contact.model';
import { SchFTransactionType } from '../schf-transaction-type.model';
import { SchFTransaction, ScheduleFTransactionTypeLabels, ScheduleFTransactionTypes } from '../schf-transaction.model';

import { AggregationGroups } from '../transaction.model';

export class COORDINATED_PARTY_EXPENDITURE_VOID extends SchFTransactionType {
  formFields = [
    ...INDIVIDUAL_FIELDS,
    ...ADDRESS_FIELDS,
    ...ORG_FIELDS,
    ...COM_FIELDS_SHORT,
    ...CANDIDATE_FIELDS,
    ...CANDIDATE_OFFICE_FIELDS,
    ...COMMON_FIELDS,
    'general_election_year',
    'aggregate_general_elec_expended',
    'filer_designated_to_make_coordinated_expenditures',
    ...CATEGORY_CODE,
    ...QUATERNARY_FIELDS,
    ...QUINARY_FIELDS,
  ];
  contactTypeOptions = ORGANIZATION_INDIVIDUAL;
  override contactConfig = CONTACTS_ONE_THROUGH_FIVE;
  title = LabelUtils.get(ScheduleFTransactionTypeLabels, ScheduleFTransactionTypes.COORDINATED_PARTY_EXPENDITURE_VOID);
  schema = schema;
  override negativeAmountValueOnly = true;

  override showAggregate = false;
  override showPayeeCandidateYTD = true;
  override dateLabel = 'DATE';

  override isCloneableTransactionType = true;

  getNewTransaction() {
    return SchFTransaction.fromJSON({
      form_type: 'SF',
      transaction_type_identifier: ScheduleFTransactionTypes.COORDINATED_PARTY_EXPENDITURE_VOID,
      aggregation_group: AggregationGroups.COORDINATED_PARTY_EXPENDITURES,
    });
  }
}
