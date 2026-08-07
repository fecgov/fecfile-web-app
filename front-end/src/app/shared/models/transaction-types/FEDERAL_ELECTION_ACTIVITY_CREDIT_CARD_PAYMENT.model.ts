import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/DISBURSEMENT_PARENTS_FEA';
import { SchBTransactionType } from '../transaction/schedule-b/schb-transaction-type.model';
import { SchBTransaction } from '../transaction/schedule-b/schb-transaction.model';
import {
  STANDARD_PARENT_CONTROLS,
  TransactionNavigationControls,
} from '../transaction/transaction-navigation-controls.model';
import { ORGANIZATION_NO_AGGREGATE_B_FORM_FIELDS, ORGANIZATION } from 'app/shared/utils/transaction-type-properties';
import {
  ScheduleBTransactionTypeLabels,
  ScheduleBTransactionTypes,
} from '../transaction/schedule-b/schedule-b-transaction-types.model';
import { AggregationGroups } from '../transaction/agregation-groups.model';

export class FEDERAL_ELECTION_ACTIVITY_CREDIT_CARD_PAYMENT extends SchBTransactionType {
  formFields = ORGANIZATION_NO_AGGREGATE_B_FORM_FIELDS;
  contactTypeOptions = ORGANIZATION;
  title = LabelUtils.get(
    ScheduleBTransactionTypeLabels,
    ScheduleBTransactionTypes.FEDERAL_ELECTION_ACTIVITY_CREDIT_CARD_PAYMENT,
  );
  schema = schema;
  override subTransactionConfig = [ScheduleBTransactionTypes.FEDERAL_ELECTION_ACTIVITY_CREDIT_CARD_PAYMENT_MEMO];
  override navigationControls: TransactionNavigationControls = STANDARD_PARENT_CONTROLS;

  getNewTransaction() {
    return SchBTransaction.fromJSON({
      form_type: 'SB30B',
      transaction_type_identifier: ScheduleBTransactionTypes.FEDERAL_ELECTION_ACTIVITY_CREDIT_CARD_PAYMENT,
      aggregation_group: AggregationGroups.GENERAL_DISBURSEMENT,
    });
  }

  override generatePurposeDescription(transaction: SchBTransaction): string {
    if (transaction.children && transaction.children.some((child) => child.itemized === true)) {
      return 'Credit Card Memo: See Below';
    }
    return 'Credit card memo entries do not meet itemization threshold.';
  }
}
