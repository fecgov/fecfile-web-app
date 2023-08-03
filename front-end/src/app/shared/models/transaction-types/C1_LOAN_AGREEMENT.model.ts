import { schema } from 'fecfile-validate/fecfile_validate_js/dist/C1_LOAN_AGREEMENT';
import { SchC1Transaction, ScheduleC1TransactionTypes } from '../schc1-transaction.model';
import { TemplateMapKeyType } from '../transaction-type.model';
import { SchC1TransactionType } from '../schc1-transaction-type.model';
import {
  ORGANIZATION,
  ORG_FIELDS,
  SECONDARY_ADDRESS_FIELDS,
  LOAN_TERMS_FIELDS,
  SIGNATORY_1_FIELDS,
  SIGNATORY_2_FIELDS,
} from 'app/shared/utils/transaction-type-properties';

export class C1_LOAN_AGREEMENT extends SchC1TransactionType {
  formFields = [
    ...ORG_FIELDS,
    ...LOAN_TERMS_FIELDS,
    ...SECONDARY_ADDRESS_FIELDS,
    ...SIGNATORY_1_FIELDS,
    ...SIGNATORY_2_FIELDS,
    'street_1',
    'street_2',
    'city',
    'state',
    'zip',
    'date',
    'amount',
    'balance',

    // C1 only fields not declared in the templateMap.
    // They are referenced directly and not via the templateMap
    // in the C1 specific form input components.

    'loan_restructured',
    'loan_originally_incurred_date',
    'credit_amount_this_draw',
    'others_liable',
    'desc_collateral',
    'collateral_value_amount',
    'perfected_interest',
    'future_income',
    'desc_specification_of_the_above',
    'estimated_value',
    'depository_account_established_date',
    'ind_name_account_location',
    'basis_of_loan_description',
  ];
  override contactTypeOptions = ORGANIZATION;
  override isDependentChild = true;
  override doMemoCodeDateCheck = false;
  title = 'Loan agreement';
  schema = schema;
  override useParentContact = true;
  override hasAdditionalInfo = false;

  override inheritedFields = [
    ...ORG_FIELDS,
    'street_1',
    'street_2',
    'city',
    'state',
    'zip',
    'amount',
    'date',
    'due_date',
    'interest_rate',
  ] as TemplateMapKeyType[];

  override description =
    'Only the Purpose of Receipt and Note/Memo Text are editable. To update any errors found, return to the previous step to update loan information.';
  override accordionTitle = 'STEP TWO';
  override accordionSubText =
    'Enter contact, loan, terms, collateral, and future income information for the loan agreeement';
  override formTitle = 'Receipt';
  override footer = undefined;
  override contactTitle = 'Contact';

  getNewTransaction() {
    return SchC1Transaction.fromJSON({
      form_type: 'SC1/10',
      transaction_type_identifier: ScheduleC1TransactionTypes.C1_LOAN_AGREEMENT,
    });
  }
}
