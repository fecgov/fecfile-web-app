import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/NATIONAL_PARTY_INDIVIDUAL_REFUNDS';
import { SchBTransactionType } from '../transaction/schedule-b/schb-transaction-type.model';
import { SchBTransaction } from '../transaction/schedule-b/schb-transaction.model';
import { STANDARD_CONTROLS, TransactionNavigationControls } from '../transaction/transaction-navigation-controls.model';
import { INDIVIDUAL_B_FORM_FIELDS, INDIVIDUAL } from 'app/shared/utils/transaction-type-properties';
import { AggregationGroups } from '../transaction/agregation-groups.model';
import {
  ScheduleBTransactionTypeLabels,
  ScheduleBTransactionTypes,
} from '../transaction/schedule-b/schedule-b-transaction-types.model';

export class INDIVIDUAL_REFUND_NP_HEADQUARTERS_ACCOUNT extends SchBTransactionType {
  formFields = INDIVIDUAL_B_FORM_FIELDS;
  contactTypeOptions = INDIVIDUAL;
  title = LabelUtils.get(
    ScheduleBTransactionTypeLabels,
    ScheduleBTransactionTypes.INDIVIDUAL_REFUND_NP_HEADQUARTERS_ACCOUNT,
  );
  schema = schema;
  override navigationControls: TransactionNavigationControls = STANDARD_CONTROLS;
  override isRefund = true;

  override get isCloneableTransactionType(): boolean {
    return true;
  }

  getNewTransaction() {
    return SchBTransaction.fromJSON({
      form_type: 'SB21B',
      transaction_type_identifier: ScheduleBTransactionTypes.INDIVIDUAL_REFUND_NP_HEADQUARTERS_ACCOUNT,
      aggregation_group: AggregationGroups.NATIONAL_PARTY_HEADQUARTERS_ACCOUNT,
    });
  }

  override generatePurposeDescription(): string {
    return 'Headquarters Buildings Account: Refund';
  }
}
