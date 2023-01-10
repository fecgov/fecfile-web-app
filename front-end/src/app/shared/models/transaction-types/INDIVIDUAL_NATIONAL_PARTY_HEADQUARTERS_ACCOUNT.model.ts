import { TransactionType } from '../../interfaces/transaction-type.interface';
import {
  SchATransaction,
  ScheduleATransactionTypes,
  ScheduleATransactionTypeLabels,
  AggregationGroups,
} from '../scha-transaction.model';
import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/INDIVIDUAL_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT';
import { STANDARD_CONTROLS, TransactionNavigationControls } from '../transaction-navigation-controls.model';

export class INDIVIDUAL_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT implements TransactionType {
  scheduleId = 'A';
  componentGroupId = 'A';
  isDependentChild = false;
  title = LabelUtils.get(
    ScheduleATransactionTypeLabels,
    ScheduleATransactionTypes.INDIVIDUAL_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT
  );
  schema = schema;
  transaction?: SchATransaction;
  navigationControls: TransactionNavigationControls = STANDARD_CONTROLS;

  generatePurposeDescription(): string {
    return 'Headquarters Buildings Account';
  }

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA17',
      transaction_type_identifier: ScheduleATransactionTypes.INDIVIDUAL_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT,
      aggregation_group: AggregationGroups.NATIONAL_PARTY_HEADQUARTERS_ACCOUNT,
    });
  }
}
