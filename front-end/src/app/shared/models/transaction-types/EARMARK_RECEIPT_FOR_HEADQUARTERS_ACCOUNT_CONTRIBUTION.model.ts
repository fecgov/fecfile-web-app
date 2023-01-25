import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/NATIONAL_PARTY_EARMARK_RECEIPTS';
import {
  AggregationGroups,
  SchATransaction,
  ScheduleATransactionTypeLabels,
  ScheduleATransactionTypes,
} from '../scha-transaction.model';
import {
  CANCEL_CONTROL,
  SAVE_LIST_CONTROL,
  TransactionNavigationControls,
} from '../transaction-navigation-controls.model';
import { SchaTransactionType } from './SchaTransactionType.model';

export class EARMARK_RECEIPT_FOR_HEADQUARTERS_ACCOUNT_CONTRIBUTION extends SchaTransactionType {
  componentGroupId = 'G';
  title = LabelUtils.get(
    ScheduleATransactionTypeLabels,
    ScheduleATransactionTypes.EARMARK_RECEIPT_FOR_HEADQUARTERS_ACCOUNT_CONTRIBUTION
  );
  schema = schema;
  override navigationControls: TransactionNavigationControls = new TransactionNavigationControls(
    [],
    [CANCEL_CONTROL],
    [SAVE_LIST_CONTROL]
  );

  override generatePurposeDescription(): string {
    let name;
    if (this.transaction?.contact?.type === 'COM') {
      name = this.transaction?.contributor_organization_name || this.transaction?.contact?.name;
    } else {
      name = `${this.transaction?.contributor_first_name || this.transaction?.contact?.first_name} ${
        this.transaction?.contributor_last_name || this.transaction?.contact?.last_name
      }`;
    }
    console.log('Called!', this, name);
    return `Headquarters Buildings Account - Earmarked Through ${name}`;
  }

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA17',
      transaction_type_identifier: ScheduleATransactionTypes.EARMARK_RECEIPT_FOR_HEADQUARTERS_ACCOUNT_CONTRIBUTION,
      aggregation_group: AggregationGroups.NATIONAL_PARTY_HEADQUARTERS_ACCOUNT,
    });
  }
}
