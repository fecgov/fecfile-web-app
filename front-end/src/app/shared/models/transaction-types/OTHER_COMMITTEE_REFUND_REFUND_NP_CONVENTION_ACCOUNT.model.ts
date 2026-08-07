import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/NATIONAL_PARTY_OTHER_COMMITTEE_REFUNDS';
import { SchBTransactionType } from '../transaction/schedule-b/schb-transaction-type.model';
import { SchBTransaction } from '../transaction/schedule-b/schb-transaction.model';
import { STANDARD_CONTROLS, TransactionNavigationControls } from '../transaction/transaction-navigation-controls.model';
import { COMMITTEE, COMMITTEE_B_FORM_FIELDS } from 'app/shared/utils/transaction-type-properties';
import { AggregationGroups } from '../transaction/agregation-groups.model';
import {
  ScheduleBTransactionTypeLabels,
  ScheduleBTransactionTypes,
} from '../transaction/schedule-b/schedule-b-transaction-types.model';

export class OTHER_COMMITTEE_REFUND_REFUND_NP_CONVENTION_ACCOUNT extends SchBTransactionType {
  formFields = COMMITTEE_B_FORM_FIELDS;
  contactTypeOptions = COMMITTEE;
  title = LabelUtils.get(
    ScheduleBTransactionTypeLabels,
    ScheduleBTransactionTypes.OTHER_COMMITTEE_REFUND_REFUND_NP_CONVENTION_ACCOUNT,
  );
  schema = schema;
  override isRefund = true;
  override navigationControls: TransactionNavigationControls = STANDARD_CONTROLS;

  override generatePurposeDescription() {
    return 'Pres. Nominating Convention Account: Refund';
  }

  override get isCloneableTransactionType(): boolean {
    return true;
  }

  getNewTransaction() {
    return SchBTransaction.fromJSON({
      form_type: 'SB21B',
      transaction_type_identifier: ScheduleBTransactionTypes.OTHER_COMMITTEE_REFUND_REFUND_NP_CONVENTION_ACCOUNT,
      aggregation_group: AggregationGroups.NATIONAL_PARTY_CONVENTION_ACCOUNT,
    });
  }
}
