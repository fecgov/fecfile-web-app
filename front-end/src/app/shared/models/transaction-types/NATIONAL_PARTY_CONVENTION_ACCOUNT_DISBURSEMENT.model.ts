import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/RECOUNT_AND_NP_DISBURSEMENTS';
import { SchBTransactionType } from '../schb-transaction-type.model';
import { SchBTransaction, ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { TransactionGroupB } from '../transaction-groups/transaction-group-b.model';
import { STANDARD_CONTROLS, TransactionNavigationControls } from '../transaction-navigation-controls.model';
import { AggregationGroups } from '../transaction.model';
import { ContactTypes } from '../contact.model';
import { GROUP_B } from 'app/shared/utils/transaction-type-properties';

export class NATIONAL_PARTY_CONVENTION_ACCOUNT_DISBURSEMENT extends SchBTransactionType {
  transactionGroup = new TransactionGroupB();
  formProperties = GROUP_B;
  title = LabelUtils.get(
    ScheduleBTransactionTypeLabels,
    ScheduleBTransactionTypes.NATIONAL_PARTY_CONVENTION_ACCOUNT_DISBURSEMENT
  );
  schema = schema;
  override defaultContactTypeOption = ContactTypes.ORGANIZATION;
  override navigationControls: TransactionNavigationControls = STANDARD_CONTROLS;
  override purposeDescriptionPrefix = 'Pres. Nominating Convention Account: ';

  getNewTransaction() {
    return SchBTransaction.fromJSON({
      form_type: 'SB21B',
      transaction_type_identifier: ScheduleBTransactionTypes.NATIONAL_PARTY_CONVENTION_ACCOUNT_DISBURSEMENT,
      aggregation_group: AggregationGroups.GENERAL_DISBURSEMENT,
    });
  }
}
