import { LabelUtils } from 'app/shared/utils/label.utils';
import { ORGANIZATION, ORGANIZATION_NO_AGGREGATE_B_FORM_FIELDS } from 'app/shared/utils/transaction-type-properties';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/DISBURSEMENT_PARENTS_FEA';
import { SchBTransactionType } from '../schb-transaction-type.model';
import { SchBTransaction, ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { STANDARD_PARENT_CONTROLS, TransactionNavigationControls } from '../transaction-navigation-controls.model';
import { AggregationGroups } from '../transaction.model';

export class FEDERAL_ELECTION_ACTIVITY_PAYMENT_TO_PAYROLL extends SchBTransactionType {
  formFields = ORGANIZATION_NO_AGGREGATE_B_FORM_FIELDS;
  contactTypeOptions = ORGANIZATION;
  title = LabelUtils.get(
    ScheduleBTransactionTypeLabels,
    ScheduleBTransactionTypes.FEDERAL_ELECTION_ACTIVITY_PAYMENT_TO_PAYROLL,
  );
  schema = schema;
  override subTransactionConfig = [ScheduleBTransactionTypes.FEDERAL_ELECTION_ACTIVITY_PAYMENT_TO_PAYROLL_MEMO];
  override navigationControls: TransactionNavigationControls = STANDARD_PARENT_CONTROLS;

  getNewTransaction() {
    return SchBTransaction.fromJSON({
      form_type: 'SB30B',
      transaction_type_identifier: ScheduleBTransactionTypes.FEDERAL_ELECTION_ACTIVITY_PAYMENT_TO_PAYROLL,
      aggregation_group: AggregationGroups.GENERAL_DISBURSEMENT,
    });
  }

  override generatePurposeDescription(): string {
    return 'Payroll: See Below';
  }
}
