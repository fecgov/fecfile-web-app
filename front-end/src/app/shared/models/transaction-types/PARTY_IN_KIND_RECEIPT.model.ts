import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/COM_IN_KIND_RECEIPTS';
import { SchATransactionType } from '../scha-transaction-type.model';
import { SchATransaction, ScheduleATransactionTypeLabels, ScheduleATransactionTypes } from '../scha-transaction.model';
import {
  STANDARD_DOUBLE_ENTRY_CONTROLS,
  TransactionNavigationControls,
} from '../transaction-navigation-controls.model';
import { AggregationGroups } from '../transaction.model';
import { ScheduleBTransactionTypes } from '../schb-transaction.model';
import { TransactionGroupEE } from '../transaction-groups/transaction-group-ee.model';

export class PARTY_IN_KIND_RECEIPT extends SchATransactionType {
  transactionGroup = new TransactionGroupEE();
  title = LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.PARTY_IN_KIND_RECEIPT);
  schema = schema;
  override apiEndpoint = '/transactions/save-pair';
  override dependentChildTransactionType = ScheduleBTransactionTypes.PARTY_IN_KIND_OUT;
  override navigationControls: TransactionNavigationControls = STANDARD_DOUBLE_ENTRY_CONTROLS;
  override purposeDescriptionPrefix = 'In Kind: ';

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA11B',
      transaction_type_identifier: ScheduleATransactionTypes.PARTY_IN_KIND_RECEIPT,
      aggregation_group: AggregationGroups.GENERAL,
    });
  }
}
