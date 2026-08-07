import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/PAC_RECOUNT_RECEIPT';
import { SchATransaction } from '../transaction/schedule-a/scha-transaction.model';
import { SchATransactionType } from '../transaction/schedule-a/scha-transaction-type.model';
import { STANDARD_CONTROLS, TransactionNavigationControls } from '../transaction/transaction-navigation-controls.model';
import { COMMITTEE, COMMITTEE_FORM_FIELDS } from 'app/shared/utils/transaction-type-properties';
import { AggregationGroups } from '../transaction/agregation-groups.model';
import {
  ScheduleATransactionTypeLabels,
  ScheduleATransactionTypes,
} from '../transaction/schedule-a/schedule-a-transaction-types.model';

export class PAC_RECOUNT_RECEIPT extends SchATransactionType {
  formFields = COMMITTEE_FORM_FIELDS;
  contactTypeOptions = COMMITTEE;
  title = LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.PAC_RECOUNT_RECEIPT);
  schema = schema;
  override navigationControls: TransactionNavigationControls = STANDARD_CONTROLS;

  override generatePurposeDescription(): string {
    return 'Recount Account';
  }

  override get isReattributable(): boolean {
    return false;
  }

  override get isCloneableTransactionType(): boolean {
    return true;
  }

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA17',
      transaction_type_identifier: ScheduleATransactionTypes.PAC_RECOUNT_RECEIPT,
      aggregation_group: AggregationGroups.RECOUNT_ACCOUNT,
    });
  }
}
