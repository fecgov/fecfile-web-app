import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/JF_TRANSFER_NATIONAL_PARTY_RECOUNT_ACCOUNT';
import { SchATransactionType } from '../transaction/schedule-a/scha-transaction-type.model';
import { SchATransaction } from '../transaction/schedule-a/scha-transaction.model';
import {
  STANDARD_PARENT_CONTROLS,
  TransactionNavigationControls,
} from '../transaction/transaction-navigation-controls.model';
import { SubTransactionGroup } from '../transaction/transaction-type.model';
import { COMMITTEE, COMMITTEE_FORM_FIELDS } from 'app/shared/utils/transaction-type-properties';
import { AggregationGroups } from '../transaction/agregation-groups.model';
import {
  ScheduleATransactionTypeLabels,
  ScheduleATransactionTypes,
} from '../transaction/schedule-a/schedule-a-transaction-types.model';

export class JF_TRANSFER_NATIONAL_PARTY_RECOUNT_ACCOUNT extends SchATransactionType {
  formFields = COMMITTEE_FORM_FIELDS;
  contactTypeOptions = COMMITTEE;
  title = LabelUtils.get(
    ScheduleATransactionTypeLabels,
    ScheduleATransactionTypes.JF_TRANSFER_NATIONAL_PARTY_RECOUNT_ACCOUNT,
  );
  schema = schema;
  override subTransactionConfig = new SubTransactionGroup(
    'JOINT FUNDRAISING TRANSFER - NATIONAL PARTY RECOUNT/LEGAL PROCEEDINGS MEMO',
    [
      ScheduleATransactionTypes.INDIVIDUAL_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO,
      ScheduleATransactionTypes.PAC_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO,
      ScheduleATransactionTypes.TRIBAL_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO,
      ScheduleATransactionTypes.PARTNERSHIP_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO,
    ],
  );
  override navigationControls: TransactionNavigationControls = STANDARD_PARENT_CONTROLS;

  override generatePurposeDescription(): string {
    return 'Recount/Legal Proceedings Account Transfer of JF Proceeds';
  }

  override get isReattributable(): boolean {
    return false;
  }

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA17',
      transaction_type_identifier: ScheduleATransactionTypes.JF_TRANSFER_NATIONAL_PARTY_RECOUNT_ACCOUNT,
      aggregation_group: AggregationGroups.NATIONAL_PARTY_RECOUNT_ACCOUNT,
    });
  }
}
