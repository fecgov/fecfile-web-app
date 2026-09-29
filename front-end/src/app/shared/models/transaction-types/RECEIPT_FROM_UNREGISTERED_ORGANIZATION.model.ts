import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/RECEIPT_FROM_UNREGISTERED_ORGANIZATION';
import { SchATransactionType } from '../scha-transaction-type.model';
import { SchATransaction, ScheduleATransactionTypeLabels, ScheduleATransactionTypes } from '../scha-transaction.model';

import { ELECTION_FIELDS, ORGANIZATION, ORGANIZATION_FORM_FIELDS } from 'app/shared/utils/transaction-type-properties';
import { ReportTypes } from '..';
import { AggregationGroups } from '../transaction.model';

export class RECEIPT_FROM_UNREGISTERED_ORGANIZATION extends SchATransactionType {
  formFields = [...ORGANIZATION_FORM_FIELDS, ...ELECTION_FIELDS];
  contactTypeOptions = ORGANIZATION;
  title = LabelUtils.get(
    ScheduleATransactionTypeLabels,
    ScheduleATransactionTypes.RECEIPT_FROM_UNREGISTERED_ORGANIZATION,
  );
  schema = schema;

  override get isReattributable(): boolean {
    return false;
  }

  override isCloneableTransactionType = true;

  override hasElectionInformation(report_type: ReportTypes): boolean {
    return report_type === ReportTypes.F3;
  }

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA11AI',
      transaction_type_identifier: ScheduleATransactionTypes.RECEIPT_FROM_UNREGISTERED_ORGANIZATION,
      aggregation_group: AggregationGroups.GENERAL,
    });
  }
}
