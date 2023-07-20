import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/DISBURSEMENT_PARENTS';
import { SchBTransactionType } from '../schb-transaction-type.model';
import { SchBTransaction, ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { STANDARD_PARENT_CONTROLS, TransactionNavigationControls } from '../transaction-navigation-controls.model';
import { AggregationGroups } from '../transaction.model';
import { GROUP_D_FOR_B, ORGANIZATION } from 'app/shared/utils/transaction-type-properties';

export class OTHER_DISBURSEMENT_CREDIT_CARD_PAYMENT extends SchBTransactionType {
  formFieldsConfig = GROUP_D_FOR_B;
  contactTypeOptions = ORGANIZATION;
  title = LabelUtils.get(
    ScheduleBTransactionTypeLabels,
    ScheduleBTransactionTypes.OTHER_DISBURSEMENT_CREDIT_CARD_PAYMENT
  );
  schema = schema;
  override navigationControls: TransactionNavigationControls = STANDARD_PARENT_CONTROLS;
  override subTransactionConfig = [ScheduleBTransactionTypes.OTHER_DISBURSEMENT_CREDIT_CARD_PAYMENT_MEMO];

  getNewTransaction() {
    return SchBTransaction.fromJSON({
      form_type: 'SB29',
      transaction_type_identifier: ScheduleBTransactionTypes.OTHER_DISBURSEMENT_CREDIT_CARD_PAYMENT,
      aggregation_group: AggregationGroups.GENERAL_DISBURSEMENT,
    });
  }

  override generatePurposeDescription(): string {
    return 'Credit Card: See Below';
  }
}
