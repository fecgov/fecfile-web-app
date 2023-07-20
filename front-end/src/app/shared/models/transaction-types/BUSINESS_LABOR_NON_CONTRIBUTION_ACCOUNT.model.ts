import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/BUSINESS_LABOR_NON_CONTRIBUTION_ACCOUNT';
import { SchATransactionType } from '../scha-transaction-type.model';
import { SchATransaction, ScheduleATransactionTypeLabels, ScheduleATransactionTypes } from '../scha-transaction.model';
import { STANDARD_CONTROLS, TransactionNavigationControls } from '../transaction-navigation-controls.model';
import { AggregationGroups } from '../transaction.model';
import { GROUP_D, ORGANIZATION } from 'app/shared/utils/transaction-type-properties';

export class BUSINESS_LABOR_NON_CONTRIBUTION_ACCOUNT extends SchATransactionType {
  formFieldsConfig = GROUP_D;
  contactTypeOptions = ORGANIZATION;
  title = LabelUtils.get(
    ScheduleATransactionTypeLabels,
    ScheduleATransactionTypes.BUSINESS_LABOR_NON_CONTRIBUTION_ACCOUNT
  );
  schema = schema;
  override navigationControls: TransactionNavigationControls = STANDARD_CONTROLS;

  override generatePurposeDescription(): string {
    return 'Non-contribution Account';
  }

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA17',
      transaction_type_identifier: ScheduleATransactionTypes.BUSINESS_LABOR_NON_CONTRIBUTION_ACCOUNT,
      aggregation_group: AggregationGroups.NON_CONTRIBUTION_ACCOUNT,
    });
  }
}
