import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/INDEPENDENT_EXPENDITURE_MEMOS';
import { SchETransactionType } from '../sche-transaction-type.model';
import { SchETransaction, ScheduleETransactionTypeLabels, ScheduleETransactionTypes } from '../sche-transaction.model';
import { CHILD_CONTROLS, TransactionNavigationControls } from '../transaction-navigation-controls.model';
import {
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
  ORGANIZATION_INDIVIDUAL,
} from 'app/shared/utils/transaction-type-properties';
import { STANDARD_AND_CANDIDATE } from '../contact.model';
import { AggregationGroups } from '../transaction.model';

export class INDEPENDENT_EXPENDITURE_CREDIT_CARD_PAYMENT_MEMO extends SchETransactionType {
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
  title = LabelUtils.get(
    ScheduleETransactionTypeLabels,
    ScheduleETransactionTypes.INDEPENDENT_EXPENDITURE_CREDIT_CARD_PAYMENT_MEMO
  );
  schema = schema;
  override navigationControls: TransactionNavigationControls = CHILD_CONTROLS;
  override contact2IsRequired = () => true;
  override showCalendarYTD = true;
  override inheritCalendarYTD = true;
  override showAggregate = false;

  getNewTransaction(properties = {}) {
    return SchETransaction.fromJSON({
      ...{
        form_type: 'SE',
        transaction_type_identifier: ScheduleETransactionTypes.INDEPENDENT_EXPENDITURE_CREDIT_CARD_PAYMENT_MEMO,
        aggregation_group: AggregationGroups.INDEPENDENT_EXPENDITURE,
      },
      ...properties,
    });
  }
}
