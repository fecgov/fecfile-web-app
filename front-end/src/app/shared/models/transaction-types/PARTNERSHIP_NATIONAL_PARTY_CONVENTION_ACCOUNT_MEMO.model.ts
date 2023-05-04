import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/PARTNERSHIP_NATIONAL_PARTY_MEMOS';
import { SchATransaction, ScheduleATransactionTypeLabels, ScheduleATransactionTypes } from '../scha-transaction.model';
import { getChildNavigationControls, TransactionNavigationControls } from '../transaction-navigation-controls.model';
import { SchATransactionType } from '../scha-transaction-type.model';
import { AggregationGroups } from '../transaction.model';

export class PARTNERSHIP_NATIONAL_PARTY_CONVENTION_ACCOUNT_MEMO extends SchATransactionType {
  componentGroupId = 'A';
  title = LabelUtils.get(
    ScheduleATransactionTypeLabels,
    ScheduleATransactionTypes.PARTNERSHIP_NATIONAL_PARTY_CONVENTION_ACCOUNT_MEMO
  );
  schema = schema;
  override updateParentOnSave = true;
  override navigationControls: TransactionNavigationControls = getChildNavigationControls();

  override generatePurposeDescription(): string {
    return 'Pres. Nominating Convention Account Partnership Attribution';
  }

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA17',
      transaction_type_identifier: ScheduleATransactionTypes.PARTNERSHIP_NATIONAL_PARTY_CONVENTION_ACCOUNT_MEMO,
      aggregation_group: AggregationGroups.NATIONAL_PARTY_CONVENTION_ACCOUNT,
    });
  }
}
