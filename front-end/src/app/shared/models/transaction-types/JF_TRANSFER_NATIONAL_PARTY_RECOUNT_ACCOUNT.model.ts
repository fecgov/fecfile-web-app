import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/JF_TRANSFER_NATIONAL_PARTY_RECOUNT_ACCOUNT';
import {
  AggregationGroups,
  SchATransaction,
  ScheduleATransactionTypeLabels,
  ScheduleATransactionTypes,
} from '../scha-transaction.model';
import { SchaTransactionType } from './SchaTransactionType.model';
import { STANDARD_CONTROLS, TransactionNavigationControls } from '../transaction-navigation-controls.model';

export class JF_TRANSFER_NATIONAL_PARTY_RECOUNT_ACCOUNT extends SchaTransactionType {
  componentGroupId = 'E';
  title = LabelUtils.get(
    ScheduleATransactionTypeLabels,
    ScheduleATransactionTypes.JF_TRANSFER_NATIONAL_PARTY_RECOUNT_ACCOUNT
  );
  schema = schema;
  override subTransactionTypes = [
    ScheduleATransactionTypes.PAC_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO,
    ScheduleATransactionTypes.INDIVIDUAL_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO,
    ScheduleATransactionTypes.TRIBAL_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO,
  ];
  override navigationControls: TransactionNavigationControls = STANDARD_CONTROLS;

  override purposeDescriptionGenerator(): string {
    return 'Recount/Legal Proceedings Account Transfer of JF Proceeds';
  }

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA17',
      transaction_type_identifier: ScheduleATransactionTypes.JF_TRANSFER_NATIONAL_PARTY_RECOUNT_ACCOUNT,
      aggregation_group: AggregationGroups.NATIONAL_PARTY_RECOUNT_ACCOUNT,
    });
  }
}
