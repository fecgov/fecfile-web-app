import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/NON_CONTRIBUTION_ACCOUNT_REFUNDS';
import { SchBTransactionType } from '../schb-transaction-type.model';
import { STANDARD_CONTROLS, TransactionNavigationControls } from '../transaction-navigation-controls.model';
import { ORGANIZATION_B_FORM_FIELDS, ORGANIZATION } from 'app/shared/utils/transaction-type-properties';
import { ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes, AggregationGroups } from '../type-enums';

export class BUSINESS_LABOR_REFUND_NON_CONTRIBUTION_ACCOUNT extends SchBTransactionType {
  formFields = ORGANIZATION_B_FORM_FIELDS;
  contactTypeOptions = ORGANIZATION;
  title = LabelUtils.get(
    ScheduleBTransactionTypeLabels,
    ScheduleBTransactionTypes.BUSINESS_LABOR_REFUND_NON_CONTRIBUTION_ACCOUNT,
  );
  schema = schema;
  override navigationControls: TransactionNavigationControls = STANDARD_CONTROLS;

  override initializationData = {
    form_type: 'SB29',
    transaction_type_identifier: ScheduleBTransactionTypes.BUSINESS_LABOR_REFUND_NON_CONTRIBUTION_ACCOUNT,
    aggregation_group: AggregationGroups.NON_CONTRIBUTION_ACCOUNT,
  };

  override generatePurposeDescription(): string {
    return 'Non-contribution Account Refund';
  }
}
