import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/DISBURSEMENT_PARENTS_FEA';
import { SchBTransactionType } from '../schb-transaction-type.model';
import { SchBTransaction, ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { STANDARD_PARENT_CONTROLS, TransactionNavigationControls } from '../transaction-navigation-controls.model';
import { AggregationGroups } from '../transaction.model';
import { GROUP_R, ORGANIZATION } from 'app/shared/utils/transaction-type-properties';

export class FEDERAL_ELECTION_ACTIVITY_CREDIT_CARD_PAYMENT extends SchBTransactionType {
  formFieldsConfig = GROUP_R;
  contactTypeOptions = ORGANIZATION;
  title = LabelUtils.get(
    ScheduleBTransactionTypeLabels,
    ScheduleBTransactionTypes.FEDERAL_ELECTION_ACTIVITY_CREDIT_CARD_PAYMENT
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

  override generatePurposeDescription(): string {
    return 'Credit Card: See Below';
  }
}
