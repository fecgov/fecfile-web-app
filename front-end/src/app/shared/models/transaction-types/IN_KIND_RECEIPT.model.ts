import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/IN_KIND_RECEIPT';
import { ContactTypes } from '../contact.model';
import { SchATransactionType } from '../scha-transaction-type.model';
import { SchATransaction, ScheduleATransactionTypeLabels, ScheduleATransactionTypes } from '../scha-transaction.model';
import { TransactionGroupAG } from '../transaction-groups/transaction-group-ag.model';
import { STANDARD_CONTROLS, TransactionNavigationControls } from '../transaction-navigation-controls.model';
import { AggregationGroups } from '../transaction.model';

export class IN_KIND_RECEIPT extends SchATransactionType {
  transactionGroup = new TransactionGroupAG();
  title = LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.IN_KIND_RECEIPT);
  schema = schema;
  //override dependentChildTransactionType = ScheduleATransactionTypes.IN_KIND_MEMO;
  override navigationControls: TransactionNavigationControls = STANDARD_CONTROLS;
  override purposeDescriptionPrefix = 'In-Kind: ';

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA11AI',
      transaction_type_identifier: ScheduleATransactionTypes.IN_KIND_RECEIPT,
      aggregation_group: AggregationGroups.GENERAL,
    });
  }
}
