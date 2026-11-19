import { schema } from 'fecfile-validate/fecfile_validate_js/dist/EARMARK_MEMO';
import { SchATransaction, ScheduleATransactionTypes, ScheduleATransactionTypeLabels } from '../scha-transaction.model';
import { AggregationGroups } from '../transaction.model';
import { LabelUtils } from 'app/shared/utils/label.utils';
import { EARMARK_MEMO as CommonEarmarkMemo } from './common-types/EARMARK_MEMO.model';
import { ELECTION_FIELDS, INDIVIDUAL_COMMITTEE_FORM_FIELDS } from 'app/shared/utils/transaction-type-properties';
import { ReportTypes } from '../reports/report.model';

export class EARMARK_MEMO extends CommonEarmarkMemo {
  override formFields = [...INDIVIDUAL_COMMITTEE_FORM_FIELDS, ...ELECTION_FIELDS];
  title = LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.EARMARK_MEMO);
  schema = schema;

  override hasElectionInformation(reportType: ReportTypes): boolean {
    return reportType === ReportTypes.F3 && super.hasElectionInformation(reportType);
  }

  getNewTransaction() {
    return SchATransaction.fromJSON({
      transaction_type_identifier: ScheduleATransactionTypes.EARMARK_MEMO,
      aggregation_group: AggregationGroups.GENERAL,
      memo_code: true,
    });
  }
}
