import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/PARTY_RECOUNT_RECEIPT';
import { SchATransactionType } from '../scha-transaction-type.model';
import { SchATransaction, ScheduleATransactionTypeLabels, ScheduleATransactionTypes } from '../scha-transaction.model';
import { STANDARD_CONTROLS, TransactionNavigationControls } from '../transaction-navigation-controls.model';
import { AggregationGroups } from '../transaction.model';
import { COMMITTEE, COMMITTEE_FORM_FIELDS } from 'app/shared/utils/transaction-type-properties';

export class PARTY_RECOUNT_RECEIPT extends SchATransactionType {
  formFields = COMMITTEE_FORM_FIELDS;
  contactTypeOptions = COMMITTEE;
  title = LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.PARTY_RECOUNT_RECEIPT);
  schema = schema;
  override navigationControls: TransactionNavigationControls = STANDARD_CONTROLS;

  override generatePurposeDescription(): string {
    return `Recount Account`;
  }

  getNewTransaction(properties = {}) {
    return SchATransaction.fromJSON({
      ...{
        form_type: 'SA17',
        transaction_type_identifier: ScheduleATransactionTypes.PARTY_RECOUNT_RECEIPT,
        aggregation_group: AggregationGroups.RECOUNT_ACCOUNT,
      },
      ...properties,
    });
  }
}
