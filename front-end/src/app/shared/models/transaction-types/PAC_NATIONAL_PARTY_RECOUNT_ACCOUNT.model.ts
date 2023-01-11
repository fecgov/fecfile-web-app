import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/PAC_NATIONAL_PARTY_RECOUNT_ACCOUNT';
import { TransactionType } from '../../interfaces/transaction-type.interface';
import {
  AggregationGroups,
  SchATransaction,
  ScheduleATransactionTypeLabels,
  ScheduleATransactionTypes,
} from '../scha-transaction.model';
import { STANDARD_CONTROLS, TransactionNavigationControls } from '../transaction-navigation-controls.model';

export class PAC_NATIONAL_PARTY_RECOUNT_ACCOUNT implements TransactionType {
  scheduleId = 'A';
  componentGroupId = 'F';
  isDependentChild = false;
  title = LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.PAC_NATIONAL_PARTY_RECOUNT_ACCOUNT);
  schema = schema;
  transaction?: SchATransaction;
  navigationControls: TransactionNavigationControls = STANDARD_CONTROLS;

  generatePurposeDescription(): string {
    return 'Recount/Legal Proceedings Account';
  }

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA17',
      transaction_type_identifier: ScheduleATransactionTypes.PAC_NATIONAL_PARTY_RECOUNT_ACCOUNT,
      aggregation_group: AggregationGroups.NATIONAL_PARTY_RECOUNT_ACCOUNT,
    });
  }
}
