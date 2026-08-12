import { LabelUtils } from 'app/shared/utils/label.utils';
import { COMMITTEE, COMMITTEE_FORM_FIELDS, ELECTION_FIELDS } from 'app/shared/utils/transaction-type-properties';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/PARTY_RETURN';
import { ReportTypes } from '..';
import { SchATransactionType } from '../scha-transaction-type.model';
import { SchATransaction, ScheduleATransactionTypeLabels, ScheduleATransactionTypes } from '../scha-transaction.model';

import { AggregationGroups } from '../transaction.model';

export class PARTY_RETURN extends SchATransactionType {
  formFields = [...COMMITTEE_FORM_FIELDS, ...ELECTION_FIELDS];
  contactTypeOptions = COMMITTEE;
  title = LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.PARTY_RETURN);
  schema = schema;
  override negativeAmountValueOnly = true;

  override hasElectionInformation(report_type: ReportTypes): boolean {
    return report_type === ReportTypes.F3;
  }

  override get isReattributable(): boolean {
    return false;
  }

  override isCloneableTransactionType = true;

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA11B',
      transaction_type_identifier: ScheduleATransactionTypes.PARTY_RETURN,
      aggregation_group: AggregationGroups.GENERAL,
    });
  }
}
