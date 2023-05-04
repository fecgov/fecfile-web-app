import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/RETURN_RECEIPT';
import { ContactTypes } from '../contact.model';
import { SchATransactionType } from '../scha-transaction-type.model';
import { SchATransaction, ScheduleATransactionTypeLabels, ScheduleATransactionTypes } from '../scha-transaction.model';
import { TransactionGroupC } from '../transaction-groups/transaction-group-c';
import { STANDARD_CONTROLS, TransactionNavigationControls } from '../transaction-navigation-controls.model';
import { AggregationGroups } from '../transaction.model';

export class RETURN_RECEIPT extends SchATransactionType {
  
  transactionGroup = new TransactionGroupC();
  title = LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.RETURNED_BOUNCED_RECEIPT_INDIVIDUAL);
  schema = schema;
  override negativeAmountValueOnly = true;
  override contactTypeOptions = [ContactTypes.INDIVIDUAL, ContactTypes.ORGANIZATION];
  override navigationControls: TransactionNavigationControls = STANDARD_CONTROLS;

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA11AI',
      transaction_type_identifier: ScheduleATransactionTypes.RETURNED_BOUNCED_RECEIPT_INDIVIDUAL,
      aggregation_group: AggregationGroups.GENERAL,
    });
  }
}
