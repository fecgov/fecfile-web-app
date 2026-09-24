import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/UNREGISTERED_ORGANIZATION_RECOUNT_RECEIPT';
import { SchATransactionType } from '../scha-transaction-type.model';
import { SchATransaction, ScheduleATransactionTypeLabels, ScheduleATransactionTypes } from '../scha-transaction.model';

import { ELECTION_FIELDS, ORGANIZATION, ORGANIZATION_FORM_FIELDS } from 'app/shared/utils/transaction-type-properties';
import { AggregationGroups } from '../transaction.model';

export class UNREGISTERED_ORGANIZATION_RECOUNT_RECEIPT extends SchATransactionType {
  formFields = [...ORGANIZATION_FORM_FIELDS, ...ELECTION_FIELDS];
  contactTypeOptions = ORGANIZATION;
  title = LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.UNREGISTERED_ORGANIZATION_RECOUNT_RECEIPT);
  schema = schema;

  override generatePurposeDescription(): string {
    return 'Recount Account';
  }

  override isReattributable(): boolean {
    return false;
  }

  override isCloneableTransactionType = true;

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA15',
      transaction_type_identifier: ScheduleATransactionTypes.UNREGISTERED_ORGANIZATION_RECOUNT_RECEIPT,
      aggregation_group: AggregationGroups.RECOUNT_ACCOUNT,
    });
  }
}
