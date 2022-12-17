import { TransactionType } from '../../interfaces/transaction-type.interface';
import {
  SchATransaction,
  ScheduleATransactionTypes,
  ScheduleATransactionTypeLabels,
  AggregationGroups,
} from '../scha-transaction.model';
import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/PAC_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT';
import {
  CANCEL_CONTROL,
  SAVE_ANOTHER_CONTROL,
  SAVE_LIST_CONTROL,
  TransactionNavigationControls,
} from '../transaction-navigation-controls.model';

export class PAC_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT implements TransactionType {
  scheduleId = 'A';
  componentGroupId = 'F';
  isDependentChild = false;
  title = LabelUtils.get(
    ScheduleATransactionTypeLabels,
    ScheduleATransactionTypes.PAC_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT
  );
  schema = schema;
  transaction?: SchATransaction;
  navigationControls: TransactionNavigationControls = new TransactionNavigationControls(
    [],
    [CANCEL_CONTROL],
    [SAVE_LIST_CONTROL, SAVE_ANOTHER_CONTROL]
  );

  generatePurposeDescription(): string {
    return 'Headquarters Buildings Account';
  }

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA17',
      transaction_type_identifier: ScheduleATransactionTypes.PAC_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT,
      aggregation_group: AggregationGroups.NATIONAL_PARTY_HEADQUARTERS_ACCOUNT,
    });
  }
}
