import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/RECEIPT_FROM_UNREGISTERED_ORGANIZATION_RETURN';
import { ReportTypes } from '..';
import { SchATransactionType } from '../scha-transaction-type.model';
import { SchATransaction, ScheduleATransactionTypeLabels, ScheduleATransactionTypes } from '../scha-transaction.model';

import { ELECTION_FIELDS, ORGANIZATION, ORGANIZATION_FORM_FIELDS } from 'app/shared/utils/transaction-type-properties';
import { AggregationGroups } from '../transaction.model';

export class RECEIPT_FROM_UNREGISTERED_ORGANIZATION_RETURN extends SchATransactionType {
  formFields = [...ORGANIZATION_FORM_FIELDS, ...ELECTION_FIELDS];
  contactTypeOptions = ORGANIZATION;
  title = LabelUtils.get(
    ScheduleATransactionTypeLabels,
    ScheduleATransactionTypes.RECEIPT_FROM_UNREGISTERED_ORGANIZATION_RETURN,
  );
  schema = schema;
  override negativeAmountValueOnly = true;

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
      transaction_type_identifier: ScheduleATransactionTypes.RECEIPT_FROM_UNREGISTERED_ORGANIZATION_RETURN,
      aggregation_group: AggregationGroups.GENERAL,
    });
  }
}
