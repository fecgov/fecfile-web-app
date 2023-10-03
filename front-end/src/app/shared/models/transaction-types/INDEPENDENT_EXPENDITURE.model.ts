import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/INDEPENDENT_EXPENDITURES';
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

export class INDEPENDENT_EXPENDITURE extends SchETransactionType {
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
    'disbursement_date',
    'support_oppose_code',
  ];
  contactTypeOptions = ORGANIZATION_INDIVIDUAL;
  override contactConfig = STANDARD_AND_CANDIDATE;
  title = LabelUtils.get(ScheduleETransactionTypeLabels, ScheduleETransactionTypes.INDEPENDENT_EXPENDITURE);
  schema = schema;
  override navigationControls: TransactionNavigationControls = STANDARD_CONTROLS;
  override contact2IsRequired = () => true;

  getNewTransaction() {
    return SchETransaction.fromJSON({
      form_type: 'SE',
      transaction_type_identifier: ScheduleETransactionTypes.INDEPENDENT_EXPENDITURE,
    });
  }
}
