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
import { GROUP_EFI } from 'app/shared/utils/transaction-type-properties';
import { IN_KIND } from 'app/shared/utils/transaction-type-labels.utils';

export class IN_KIND_TRANSFER extends SchATransactionType {
  formFieldsConfig = GROUP_EFI;
  override labelConfig = IN_KIND;
  title = LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.IN_KIND_TRANSFER);
  schema = schema;
  override apiEndpoint = '/transactions/save-pair';
  override dependentChildTransactionType = ScheduleBTransactionTypes.IN_KIND_TRANSFER_OUT;
  override navigationControls: TransactionNavigationControls = STANDARD_DOUBLE_ENTRY_CONTROLS;
  override purposeDescriptionPrefix = 'In-Kind: ';

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA12',
      transaction_type_identifier: ScheduleATransactionTypes.IN_KIND_TRANSFER,
      aggregation_group: AggregationGroups.GENERAL,
    });
  }
}
