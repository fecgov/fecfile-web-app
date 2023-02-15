import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/BUSINESS_LABOR_NON_CONTRIBUTION_ACCOUNT';
import { AggregationGroups } from '../transaction.model';
import { SchATransaction, ScheduleATransactionTypeLabels, ScheduleATransactionTypes } from '../scha-transaction.model';
import { SchaTransactionType } from './SchaTransactionType.model';
import { STANDARD_CONTROLS, TransactionNavigationControls } from '../transaction-navigation-controls.model';

export class BUSINESS_LABOR_NON_CONTRIBUTION_ACCOUNT extends SchaTransactionType {
  componentGroupId = 'D';
  title = LabelUtils.get(
    ScheduleATransactionTypeLabels,
    ScheduleATransactionTypes.BUSINESS_LABOR_NON_CONTRIBUTION_ACCOUNT
  );
  schema = schema;
  override navigationControls: TransactionNavigationControls = STANDARD_CONTROLS;

  override generatePurposeDescription(): string {
    return 'Non-contribution Account Receipt';
  }

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA17',
      transaction_type_identifier: ScheduleATransactionTypes.BUSINESS_LABOR_NON_CONTRIBUTION_ACCOUNT,
      aggregation_group: AggregationGroups.NON_CONTRIBUTION_ACCOUNT,
    });
  }
}
