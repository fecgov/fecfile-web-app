import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/DISBURSEMENTS';
import { SchBTransactionType } from '../transaction/schedule-b/schb-transaction-type.model';
import { SchBTransaction } from '../transaction/schedule-b/schb-transaction.model';
import { STANDARD_CONTROLS, TransactionNavigationControls } from '../transaction/transaction-navigation-controls.model';
import {
  INDIVIDUAL_ORGANIZATION_B_FORM_FIELDS,
  ORGANIZATION_INDIVIDUAL_COMMITTEE,
} from 'app/shared/utils/transaction-type-properties';
import { AggregationGroups } from '../transaction/agregation-groups.model';
import {
  ScheduleBTransactionTypeLabels,
  ScheduleBTransactionTypes,
} from '../transaction/schedule-b/schedule-b-transaction-types.model';

export class OPERATING_EXPENDITURE_VOID extends SchBTransactionType {
  formFields = INDIVIDUAL_ORGANIZATION_B_FORM_FIELDS;
  override contactTypeOptions = ORGANIZATION_INDIVIDUAL_COMMITTEE;
  title = LabelUtils.get(ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes.OPERATING_EXPENDITURE_VOID);
  schema = schema;
  override negativeAmountValueOnly = true;
  override navigationControls: TransactionNavigationControls = STANDARD_CONTROLS;

  override get isCloneableTransactionType(): boolean {
    return true;
  }

  getNewTransaction() {
    return SchBTransaction.fromJSON({
      form_type: 'SB21B',
      transaction_type_identifier: ScheduleBTransactionTypes.OPERATING_EXPENDITURE_VOID,
      aggregation_group: AggregationGroups.GENERAL_DISBURSEMENT,
    });
  }
}
