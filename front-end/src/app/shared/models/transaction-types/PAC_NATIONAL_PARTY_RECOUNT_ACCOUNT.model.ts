import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/PAC_NATIONAL_PARTY_RECOUNT_ACCOUNT';
import { SchATransaction } from '../transaction/schedule-a/scha-transaction.model';
import { SchATransactionType } from '../transaction/schedule-a/scha-transaction-type.model';
import { STANDARD_CONTROLS, TransactionNavigationControls } from '../transaction/transaction-navigation-controls.model';
import { COMMITTEE, COMMITTEE_FORM_FIELDS } from 'app/shared/utils/transaction-type-properties';
import { AggregationGroups } from '../transaction/agregation-groups.model';
import {
  ScheduleATransactionTypeLabels,
  ScheduleATransactionTypes,
} from '../transaction/schedule-a/schedule-a-transaction-types.model';

export class PAC_NATIONAL_PARTY_RECOUNT_ACCOUNT extends SchATransactionType {
  formFields = COMMITTEE_FORM_FIELDS;
  contactTypeOptions = COMMITTEE;
  title = LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.PAC_NATIONAL_PARTY_RECOUNT_ACCOUNT);
  schema = schema;
  override navigationControls: TransactionNavigationControls = STANDARD_CONTROLS;

  override generatePurposeDescription(): string {
    return 'Recount/Legal Proceedings Account';
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
      transaction_type_identifier: ScheduleATransactionTypes.PAC_NATIONAL_PARTY_RECOUNT_ACCOUNT,
      aggregation_group: AggregationGroups.NATIONAL_PARTY_RECOUNT_ACCOUNT,
    });
  }
}
