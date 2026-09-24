import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/INDIVIDUAL_RECOUNT_RECEIPT';
import { SchATransactionType } from '../scha-transaction-type.model';
import { SchATransaction, ScheduleATransactionTypeLabels, ScheduleATransactionTypes } from '../scha-transaction.model';

import { ELECTION_FIELDS, INDIVIDUAL, INDIVIDUAL_FORM_FIELDS } from 'app/shared/utils/transaction-type-properties';
import { ReportTypes } from '../reports/report.model';
import { AggregationGroups } from '../transaction.model';

export class INDIVIDUAL_RECOUNT_RECEIPT extends SchATransactionType {
  formFields = [...INDIVIDUAL_FORM_FIELDS, ...ELECTION_FIELDS];
  contactTypeOptions = INDIVIDUAL;
  title = LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.INDIVIDUAL_RECOUNT_RECEIPT);
  schema = schema;

  override generatePurposeDescription(): string {
    return 'Recount Account';
  }

  override hasElectionInformation(report_type: ReportTypes): boolean {
    return report_type === ReportTypes.F3;
  }

  override isReattributable(report_type: ReportTypes): boolean {
    if (report_type === ReportTypes.F3) {
      return true;
    }
    return super.isReattributable(report_type);
  }

  override isCloneableTransactionType = true;

  getNewTransaction(report_type: ReportTypes) {
    return SchATransaction.fromJSON({
      form_type: report_type === ReportTypes.F3 ? 'SA15' : report_type === ReportTypes.F3X ? 'SA17' : '',
      transaction_type_identifier: ScheduleATransactionTypes.INDIVIDUAL_RECOUNT_RECEIPT,
      aggregation_group: AggregationGroups.RECOUNT_ACCOUNT,
    });
  }
}
