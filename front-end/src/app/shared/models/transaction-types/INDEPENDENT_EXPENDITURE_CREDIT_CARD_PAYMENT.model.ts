import { LabelUtils } from 'app/shared/utils/label.utils';
import {
  ADDRESS_FIELDS,
  AGGREGATE,
  CANDIDATE_FIELDS,
  CANDIDATE_OFFICE_FIELDS,
  CATEGORY_CODE,
  COMMON_FIELDS,
  ELECTION_FIELDS,
  ORGANIZATION,
  ORG_FIELDS,
  SIGNATORY_1_FIELDS,
} from 'app/shared/utils/transaction-type-properties';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/INDEPENDENT_EXPENDITURE_PARENTS';
import { STANDARD_AND_CANDIDATE } from '../contact.model';
import { SchETransactionType } from '../sche-transaction-type.model';
import { SchETransaction, ScheduleETransactionTypeLabels, ScheduleETransactionTypes } from '../sche-transaction.model';
import { STANDARD_PARENT_CONTROLS, TransactionNavigationControls } from '../transaction-navigation-controls.model';
import { AggregationGroups } from '../transaction.model';

export class INDEPENDENT_EXPENDITURE_CREDIT_CARD_PAYMENT extends SchETransactionType {
  formFields = [
    ...ORG_FIELDS,
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
  contactTypeOptions = ORGANIZATION;
  override contactConfig = STANDARD_AND_CANDIDATE;
  title = LabelUtils.get(
    ScheduleETransactionTypeLabels,
    ScheduleETransactionTypes.INDEPENDENT_EXPENDITURE_CREDIT_CARD_PAYMENT,
  );
  schema = schema;
  override navigationControls: TransactionNavigationControls = STANDARD_PARENT_CONTROLS;
  override contact2IsRequired = () => true;
  override subTransactionConfig = [ScheduleETransactionTypes.INDEPENDENT_EXPENDITURE_CREDIT_CARD_PAYMENT_MEMO];
  override showCalendarYTD = true;

  override generatePurposeDescription(transaction: SchETransaction): string {
    if (
      transaction.children &&
      transaction.children.length > 0 &&
      transaction.children.some((child) => child.itemized === true)
    ) {
      return 'Credit Card Memo: See Below';
    }
    return 'Credit card memo entries do not meet itemization threshold.';
  }

  getNewTransaction() {
    return SchETransaction.fromJSON({
      form_type: 'SE',
      transaction_type_identifier: ScheduleETransactionTypes.INDEPENDENT_EXPENDITURE_CREDIT_CARD_PAYMENT,
      aggregation_group: AggregationGroups.INDEPENDENT_EXPENDITURE,
    });
  }
}
