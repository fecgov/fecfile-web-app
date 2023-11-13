import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/LOAN_REPAYMENT_MADE';
import { SchBTransactionType } from '../schb-transaction-type.model';
import { SchBTransaction, ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { STANDARD_CONTROLS, TransactionNavigationControls } from '../transaction-navigation-controls.model';
import {
  ORG_FIELDS,
  ADDRESS_FIELDS,
  COMMON_FIELDS,
  INDIVIDUAL_FIELDS,
  ORGANIZATION_INDIVIDUAL_COMMITTEE,
} from 'app/shared/utils/transaction-type-properties';
import { TemplateMapKeyType } from '../transaction-type.model';

export class LOAN_REPAYMENT_MADE extends SchBTransactionType {
  formFields = [...ADDRESS_FIELDS, ...COMMON_FIELDS, ...INDIVIDUAL_FIELDS, ...ORG_FIELDS];
  contactTypeOptions = ORGANIZATION_INDIVIDUAL_COMMITTEE;
  title = LabelUtils.get(ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes.LOAN_REPAYMENT_MADE);
  schema = schema;
  override navigationControls: TransactionNavigationControls = STANDARD_CONTROLS;
  override showAggregate = false;
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

  getNewTransaction(properties = {}) {
    return SchBTransaction.fromJSON({
      ...{
        form_type: 'SB26',
        transaction_type_identifier: ScheduleBTransactionTypes.LOAN_REPAYMENT_MADE,
      },
      ...properties,
    });
  }
}
