import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/DISBURSEMENT_MEMOS_FEA';
import { ContactTypes } from '../contact.model';
import { SchBTransactionType } from '../schb-transaction-type.model';
import { SchBTransaction, ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { TransactionGroupS } from '../transaction-groups/transaction-group-s.model';
import { getChildNavigationControls, TransactionNavigationControls } from '../transaction-navigation-controls.model';
import { AggregationGroups } from '../transaction.model';

export class FEDERAL_ELECTION_ACTIVITY_PAYMENT_TO_PAYROLL_MEMO extends SchBTransactionType {
  transactionGroup = new TransactionGroupS();
  title = LabelUtils.get(
    ScheduleBTransactionTypeLabels,
    ScheduleBTransactionTypes.FEDERAL_ELECTION_ACTIVITY_PAYMENT_TO_PAYROLL_MEMO
  );
  schema = schema;
  override defaultContactTypeOption = ContactTypes.INDIVIDUAL;
  override navigationControls: TransactionNavigationControls = getChildNavigationControls();

  getNewTransaction() {
    return SchBTransaction.fromJSON({
      form_type: 'SB30B',
      transaction_type_identifier: ScheduleBTransactionTypes.FEDERAL_ELECTION_ACTIVITY_PAYMENT_TO_PAYROLL_MEMO,
      aggregation_group: AggregationGroups.GENERAL_DISBURSEMENT,
    });
  }
}