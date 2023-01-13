import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/RETURN_RECEIPT';
import { ContactTypes } from '../contact.model';
import {
  AggregationGroups,
  SchATransaction,
  ScheduleATransactionTypeLabels,
  ScheduleATransactionTypes
} from '../scha-transaction.model';
import { STANDARD_CONTROLS, TransactionNavigationControls } from '../transaction-navigation-controls.model';
import { SchaTransactionType } from './SchaTransactionType.model';

export class RETURN_RECEIPT extends SchaTransactionType {
  componentGroupId = 'C';
  title = LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.RETURNED_BOUNCED_RECEIPT_INDIVIDUAL);
  schema = schema;
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
