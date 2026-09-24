import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/PARTY_RECOUNT_RECEIPT';
import { SchATransactionType } from '../scha-transaction-type.model';
import { SchATransaction, ScheduleATransactionTypeLabels, ScheduleATransactionTypes } from '../scha-transaction.model';

import { COMMITTEE, COMMITTEE_FORM_FIELDS, ELECTION_FIELDS } from 'app/shared/utils/transaction-type-properties';
import { ReportTypes } from '../reports/report.model';
import { AggregationGroups } from '../transaction.model';

export class PARTY_RECOUNT_RECEIPT extends SchATransactionType {
  formFields = [...COMMITTEE_FORM_FIELDS, ...ELECTION_FIELDS];
  contactTypeOptions = COMMITTEE;
  title = LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.PARTY_RECOUNT_RECEIPT);
  schema = schema;

  override generatePurposeDescription(): string {
    return `Recount Account`;
  }

  override hasElectionInformation(report_type: ReportTypes): boolean {
    return report_type === ReportTypes.F3;
  }

  override isReattributable(): boolean {
    return false;
  }

  override isCloneableTransactionType = true;

  getNewTransaction(report_type: ReportTypes) {
    return SchATransaction.fromJSON({
      form_type: report_type === ReportTypes.F3 ? 'SA15' : report_type === ReportTypes.F3X ? 'SA17' : '',
      transaction_type_identifier: ScheduleATransactionTypes.PARTY_RECOUNT_RECEIPT,
      aggregation_group: AggregationGroups.RECOUNT_ACCOUNT,
    });
  }
}
