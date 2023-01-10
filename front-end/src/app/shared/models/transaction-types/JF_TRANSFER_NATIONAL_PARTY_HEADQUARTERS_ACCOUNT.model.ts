import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/JF_TRANSFER_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT';
import { TransactionType } from '../../interfaces/transaction-type.interface';
import {
  AggregationGroups,
  SchATransaction,
  ScheduleATransactionTypeLabels,
  ScheduleATransactionTypes,
} from '../scha-transaction.model';
import { STANDARD_CONTROLS, TransactionNavigationControls } from '../transaction-navigation-controls.model';

export class JF_TRANSFER_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT implements TransactionType {
  scheduleId = 'A';
  componentGroupId = 'E';
  isDependentChild = false;
  title = LabelUtils.get(
    ScheduleATransactionTypeLabels,
    ScheduleATransactionTypes.JF_TRANSFER_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT
  );
  schema = schema;
  transaction?: SchATransaction;
  subTransactionTypes = [
    ScheduleATransactionTypes.INDIVIDUAL_NATIONAL_PARTY_HEADQUARTERS_JF_TRANSFER_MEMO,
    ScheduleATransactionTypes.PAC_NATIONAL_PARTY_HEADQUARTERS_JF_TRANSFER_MEMO,
    ScheduleATransactionTypes.TRIBAL_NATIONAL_PARTY_HEADQUARTERS_JF_TRANSFER_MEMO,
    ScheduleATransactionTypes.PARTNERSHIP_NATIONAL_PARTY_HEADQUARTERS_JF_TRANSFER_MEMO,
  ];
  navigationControls: TransactionNavigationControls = STANDARD_CONTROLS;

  generatePurposeDescription(): string {
    return 'Headquarters Buildings Account Transfer of JF Proceeds';
  }

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA17',
      transaction_type_identifier: ScheduleATransactionTypes.JF_TRANSFER_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT,
      aggregation_group: AggregationGroups.NATIONAL_PARTY_HEADQUARTERS_ACCOUNT,
    });
  }
}
