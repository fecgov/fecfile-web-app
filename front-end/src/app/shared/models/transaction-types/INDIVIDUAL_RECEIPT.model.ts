import { LabelUtils } from 'app/shared/utils/label.utils';
import { ELECTION_FIELDS, INDIVIDUAL, INDIVIDUAL_FORM_FIELDS } from 'app/shared/utils/transaction-type-properties';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/INDIVIDUAL_RECEIPT';
import { SchATransactionType } from '../transaction/schedule-a/scha-transaction-type.model';
import { SchATransaction } from '../transaction/schedule-a/scha-transaction.model';
import { STANDARD_CONTROLS, TransactionNavigationControls } from '../transaction/transaction-navigation-controls.model';
import { ReportTypes } from '../reports/report-types.model';
import { AggregationGroups } from '../transaction/agregation-groups.model';
import {
  ScheduleATransactionTypeLabels,
  ScheduleATransactionTypes,
} from '../transaction/schedule-a/schedule-a-transaction-types.model';

export class INDIVIDUAL_RECEIPT extends SchATransactionType {
  formFields = [...INDIVIDUAL_FORM_FIELDS, ...ELECTION_FIELDS];
  contactTypeOptions = INDIVIDUAL;
  title = LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.INDIVIDUAL_RECEIPT);
  schema = schema;
  override navigationControls: TransactionNavigationControls = STANDARD_CONTROLS;

  override hasElectionInformation(report_type: ReportTypes): boolean {
    return report_type === ReportTypes.F3;
  }

  override get isCloneableTransactionType(): boolean {
    return true;
  }

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA11AI',
      transaction_type_identifier: ScheduleATransactionTypes.INDIVIDUAL_RECEIPT,
      aggregation_group: AggregationGroups.GENERAL,
    });
  }
}
