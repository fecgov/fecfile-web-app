import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/OFFSET_TO_OPERATING_EXPENDITURES';
import { SchATransactionType } from '../scha-transaction-type.model';
import { SchATransaction, ScheduleATransactionTypeLabels, ScheduleATransactionTypes } from '../scha-transaction.model';

import { AggregationGroups } from '../transaction.model';
import {
  INDIVIDUAL_ORGANIZATION_FORM_FIELDS,
  ORGANIZATION_INDIVIDUAL_COMMITTEE,
  ELECTION_FIELDS,
} from 'app/shared/utils/transaction-type-properties';
import { ReportTypes } from '../reports/report.model';

export class OFFSET_TO_OPERATING_EXPENDITURES extends SchATransactionType {
  formFields = [...INDIVIDUAL_ORGANIZATION_FORM_FIELDS, ...ELECTION_FIELDS];
  contactTypeOptions = ORGANIZATION_INDIVIDUAL_COMMITTEE;
  title = LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.OFFSET_TO_OPERATING_EXPENDITURES);
  schema = schema;

  override isReattributable(): boolean {
    return false;
  }

  override hasElectionInformation(report_type: ReportTypes): boolean {
    return report_type === ReportTypes.F3;
  }

  override isCloneableTransactionType = true;

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA15',
      transaction_type_identifier: ScheduleATransactionTypes.OFFSET_TO_OPERATING_EXPENDITURES,
      aggregation_group: AggregationGroups.LINE_15,
    });
  }
}
