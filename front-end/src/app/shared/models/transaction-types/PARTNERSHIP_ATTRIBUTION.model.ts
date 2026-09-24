import { LabelUtils } from 'app/shared/utils/label.utils';
import { ELECTION_FIELDS, INDIVIDUAL, INDIVIDUAL_FORM_FIELDS } from 'app/shared/utils/transaction-type-properties';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/PARTNERSHIP_ATTRIBUTION';
import { ReportTypes } from '../reports/report.model';
import { SchATransactionType } from '../scha-transaction-type.model';
import { SchATransaction, ScheduleATransactionTypeLabels, ScheduleATransactionTypes } from '../scha-transaction.model';
import { CHILD_CONTROLS } from '../transaction-navigation-controls.model';
import { AggregationGroups } from '../transaction.model';

export class PARTNERSHIP_ATTRIBUTION extends SchATransactionType {
  formFields = [...INDIVIDUAL_FORM_FIELDS, ...ELECTION_FIELDS];
  contactTypeOptions = INDIVIDUAL;
  title = LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.PARTNERSHIP_ATTRIBUTION);
  schema = schema;
  override _navigationControls = CHILD_CONTROLS;
  override inheritElectionInfo = true;

  override generatePurposeDescription(): string {
    return 'Partnership Attribution';
  }

  override hasElectionInformation(report_type: ReportTypes): boolean {
    return report_type === ReportTypes.F3;
  }

  override isReattributable(report_type: ReportTypes): boolean {
    if (report_type === ReportTypes.F3) {
      return false;
    }
    return super.isReattributable(report_type);
  }

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA11AI',
      transaction_type_identifier: ScheduleATransactionTypes.PARTNERSHIP_ATTRIBUTION,
      aggregation_group: AggregationGroups.GENERAL,
    });
  }
}
