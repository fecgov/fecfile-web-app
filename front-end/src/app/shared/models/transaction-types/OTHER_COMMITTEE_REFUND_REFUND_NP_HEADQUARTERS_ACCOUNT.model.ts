import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/NATIONAL_PARTY_OTHER_COMMITTEE_REFUNDS';
import { SchBTransactionType } from '../schb-transaction-type.model';
import { SchBTransaction, ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { STANDARD_CONTROLS, TransactionNavigationControls } from '../transaction-navigation-controls.model';
import { AggregationGroups } from '../transaction.model';
import { COMMITTEE, COMMITTEE_B_FORM_FIELDS } from 'app/shared/utils/transaction-type-properties';

export class OTHER_COMMITTEE_REFUND_REFUND_NP_HEADQUARTERS_ACCOUNT extends SchBTransactionType {
  formFields = COMMITTEE_B_FORM_FIELDS;
  contactTypeOptions = COMMITTEE;
  title = LabelUtils.get(
    ScheduleBTransactionTypeLabels,
    ScheduleBTransactionTypes.OTHER_COMMITTEE_REFUND_REFUND_NP_HEADQUARTERS_ACCOUNT
  );
  schema = schema;
  override showAggregate = false;
  override isRefund = true;
  override navigationControls: TransactionNavigationControls = STANDARD_CONTROLS;

  override generatePurposeDescription() {
    return 'Headquarters Buildings Account: Refund';
  }

  getNewTransaction() {
    return SchBTransaction.fromJSON({
      form_type: 'SB21B',
      transaction_type_identifier: ScheduleBTransactionTypes.OTHER_COMMITTEE_REFUND_REFUND_NP_HEADQUARTERS_ACCOUNT,
      aggregation_group: AggregationGroups.NATIONAL_PARTY_HEADQUARTERS_ACCOUNT,
    });
  }
}
