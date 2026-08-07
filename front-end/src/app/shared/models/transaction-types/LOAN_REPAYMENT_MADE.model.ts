import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/LOAN_REPAYMENT_MADE';
import { SchBTransactionType } from '../transaction/schedule-b/schb-transaction-type.model';
import { SchBTransaction } from '../transaction/schedule-b/schb-transaction.model';
import { STANDARD_CONTROLS, TransactionNavigationControls } from '../transaction/transaction-navigation-controls.model';
import {
  ORG_FIELDS,
  ADDRESS_FIELDS,
  COMMON_FIELDS,
  INDIVIDUAL_FIELDS,
  ORGANIZATION_INDIVIDUAL_COMMITTEE,
} from 'app/shared/utils/transaction-type-properties';
import { TemplateMapKeyType } from '../transaction/transaction-type.model';
import {
  ScheduleBTransactionTypeLabels,
  ScheduleBTransactionTypes,
} from '../transaction/schedule-b/schedule-b-transaction-types.model';

export class LOAN_REPAYMENT_MADE extends SchBTransactionType {
  formFields = [...ADDRESS_FIELDS, ...COMMON_FIELDS, ...INDIVIDUAL_FIELDS, ...ORG_FIELDS];
  contactTypeOptions = ORGANIZATION_INDIVIDUAL_COMMITTEE;
  title = LabelUtils.get(ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes.LOAN_REPAYMENT_MADE);
  schema = schema;
  override navigationControls: TransactionNavigationControls = STANDARD_CONTROLS;
  override inheritedFields = [
    ...INDIVIDUAL_FIELDS,
    ...ORG_FIELDS,
    'street_1',
    'street_2',
    'city',
    'state',
    'zip',
  ] as TemplateMapKeyType[];

  override generatePurposeDescription(): string {
    return 'Loan Repayment';
  }

  getNewTransaction() {
    return SchBTransaction.fromJSON({
      form_type: 'SB26',
      transaction_type_identifier: ScheduleBTransactionTypes.LOAN_REPAYMENT_MADE,
    });
  }
}
