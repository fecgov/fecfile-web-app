import { LabelUtils } from 'app/shared/utils/label.utils';
import { COMMITTEE, COMMITTEE_FORM_FIELDS, ELECTION_FIELDS } from 'app/shared/utils/transaction-type-properties';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/PARTY_RETURN';
import { SchATransactionType } from '../transaction/schedule-a/scha-transaction-type.model';
import { SchATransaction } from '../transaction/schedule-a/scha-transaction.model';
import { STANDARD_CONTROLS, TransactionNavigationControls } from '../transaction/transaction-navigation-controls.model';
import { ReportTypes } from '../reports/report-types.model';
import { AggregationGroups } from '../transaction/agregation-groups.model';
import {
  ScheduleATransactionTypeLabels,
  ScheduleATransactionTypes,
} from '../transaction/schedule-a/schedule-a-transaction-types.model';

export class PARTY_RETURN extends SchATransactionType {
  formFields = [...COMMITTEE_FORM_FIELDS, ...ELECTION_FIELDS];
  contactTypeOptions = COMMITTEE;
  title = LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.PARTY_RETURN);
  schema = schema;
  override negativeAmountValueOnly = true;
  override navigationControls: TransactionNavigationControls = STANDARD_CONTROLS;

  override hasElectionInformation(report_type: ReportTypes): boolean {
    return report_type === ReportTypes.F3;
  }

  override get isReattributable(): boolean {
    return false;
  }

  override get isCloneableTransactionType(): boolean {
    return true;
  }

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA11B',
      transaction_type_identifier: ScheduleATransactionTypes.PARTY_RETURN,
      aggregation_group: AggregationGroups.GENERAL,
    });
  }
}
