import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/DISBURSEMENT_MEMOS_FEA';
import { SchBTransactionType } from '../schb-transaction-type.model';
import { SchBTransaction, ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { getChildNavigationControls, TransactionNavigationControls } from '../transaction-navigation-controls.model';
import { AggregationGroups } from '../transaction.model';
import {
  INDIVIDUAL_ORGANIZATION_ELECTION_B_FORM_FIELDS,
  INDIVIDUAL_ORGANIZATION_COMMITTEE,
} from 'app/shared/utils/transaction-type-properties';

export class FEDERAL_ELECTION_ACTIVITY_PAYMENT_TO_PAYROLL_MEMO extends SchBTransactionType {
  formFields = INDIVIDUAL_ORGANIZATION_ELECTION_B_FORM_FIELDS;
  contactTypeOptions = INDIVIDUAL_ORGANIZATION_COMMITTEE;
  title = LabelUtils.get(
    ScheduleBTransactionTypeLabels,
    ScheduleBTransactionTypes.FEDERAL_ELECTION_ACTIVITY_PAYMENT_TO_PAYROLL_MEMO
  );
  schema = schema;
  override navigationControls: TransactionNavigationControls = getChildNavigationControls();

  getNewTransaction() {
    return SchBTransaction.fromJSON({
      form_type: 'SB30B',
      transaction_type_identifier: ScheduleBTransactionTypes.FEDERAL_ELECTION_ACTIVITY_PAYMENT_TO_PAYROLL_MEMO,
      aggregation_group: AggregationGroups.GENERAL_DISBURSEMENT,
    });
  }
}
