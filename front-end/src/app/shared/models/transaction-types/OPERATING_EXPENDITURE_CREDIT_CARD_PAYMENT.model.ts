import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/DISBURSEMENT_PARENTS';
import { SchBTransactionType } from '../schb-transaction-type.model';
import { SchBTransaction, ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { STANDARD_PARENT_CONTROLS, TransactionNavigationControls } from '../transaction-navigation-controls.model';
import { AggregationGroups } from '../transaction.model';
import { GROUP_D_FOR_B, ORGANIZATION } from 'app/shared/utils/transaction-type-properties';

export class OPERATING_EXPENDITURE_CREDIT_CARD_PAYMENT extends SchBTransactionType {
  formFieldsConfig = GROUP_D_FOR_B;
  contactTypeOptions = ORGANIZATION;
  title = LabelUtils.get(
    ScheduleBTransactionTypeLabels,
    ScheduleBTransactionTypes.OPERATING_EXPENDITURE_CREDIT_CARD_PAYMENT
  );
  schema = schema;
  override subTransactionConfig = [ScheduleBTransactionTypes.OPERATING_EXPENDITURE_CREDIT_CARD_PAYMENT_MEMO];
  override navigationControls: TransactionNavigationControls = STANDARD_PARENT_CONTROLS;

  getNewTransaction() {
    return SchBTransaction.fromJSON({
      form_type: 'SB21B',
      transaction_type_identifier: ScheduleBTransactionTypes.OPERATING_EXPENDITURE_CREDIT_CARD_PAYMENT,
      aggregation_group: AggregationGroups.GENERAL_DISBURSEMENT,
    });
  }

  override generatePurposeDescription(): string {
    return 'Credit Card: See Below';
  }
}
