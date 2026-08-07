import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/INDEPENDENT_EXPENDITURE_PARENTS';
import { SchETransactionType } from '../transaction/schedule-e/sche-transaction-type.model';
import { SchETransaction } from '../transaction/schedule-e/sche-transaction.model';
import {
  STANDARD_PARENT_CONTROLS,
  TransactionNavigationControls,
} from '../transaction/transaction-navigation-controls.model';
import {
  ORG_FIELDS,
  ADDRESS_FIELDS,
  ELECTION_FIELDS,
  COMMON_FIELDS,
  CATEGORY_CODE,
  SIGNATORY_1_FIELDS,
  AGGREGATE,
  CANDIDATE_FIELDS,
  CANDIDATE_OFFICE_FIELDS,
  ORGANIZATION,
} from 'app/shared/utils/transaction-type-properties';
import { STANDARD_AND_CANDIDATE } from '../contacts/contact.model';
import { AggregationGroups } from '../transaction/agregation-groups.model';
import {
  ScheduleETransactionTypeLabels,
  ScheduleETransactionTypes,
} from '../transaction/schedule-e/schedule-e-transaction-types.model';

export class INDEPENDENT_EXPENDITURE_PAYMENT_TO_PAYROLL extends SchETransactionType {
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
    ScheduleETransactionTypes.INDEPENDENT_EXPENDITURE_PAYMENT_TO_PAYROLL,
  );
  schema = schema;
  override navigationControls: TransactionNavigationControls = STANDARD_PARENT_CONTROLS;
  override contact2IsRequired = () => true;
  override subTransactionConfig = [ScheduleETransactionTypes.INDEPENDENT_EXPENDITURE_PAYMENT_TO_PAYROLL_MEMO];
  override showCalendarYTD = true;

  override generatePurposeDescription(transaction: SchETransaction): string {
    if (transaction.children && transaction.children.some((child) => child.itemized === true)) {
      return 'Payroll Memo: See Below';
    }
    return 'Payroll memo entries do not meet itemization threshold.';
  }

  getNewTransaction() {
    return SchETransaction.fromJSON({
      form_type: 'SE',
      transaction_type_identifier: ScheduleETransactionTypes.INDEPENDENT_EXPENDITURE_PAYMENT_TO_PAYROLL,
      aggregation_group: AggregationGroups.INDEPENDENT_EXPENDITURE,
    });
  }
}
