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
import { STANDARD_AND_SECONDARY } from '../contact.model';
import { FormGroup } from '@angular/forms';

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
    'secondary_name',

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
    'basis_of_loan_description',

    // The line_of_credit field is strictly to save UI state on the front-end
    // and is not part of the SchC1 spec
    'line_of_credit',
    'entity_type', // entity_type is not part of the C1_LOAN_AGREEMENT spec but we need to save it to the database
  ];
  override contactConfig = STANDARD_AND_SECONDARY;
  override contactTypeOptions = ORGANIZATION;
  override contact2IsRequired = (form: FormGroup) => form.get('future_income')?.value;
  override isDependentChild = true;
  override doMemoCodeDateCheck = false;
  schema = schema;
  override useParentContact = true;
  override hasAmountInput = false;
  override hasLoanAgreement = true;
  override hasSignature1 = true;
  override hasSignature2 = true;
  override hasAdditionalInfo = false;
  override signatoryOneTitle = 'Committee treasurer';
  override signatoryTwoTitle = 'Authorized representative';

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
    'due_date_setting',
    'interest_rate',
    'interest_rate_setting',
  ] as TemplateMapKeyType[];

  // override description =
  //   'Only the Purpose of Receipt and Note/Memo Text are editable. To update any errors found, return to the previous step to update loan information.';
  override accordionTitle = 'STEP TWO';
  override accordionSubText =
    'Enter contact, loan, terms, collateral, and future income information for the loan agreeement';
  override formTitle = 'Receipt';
  override footer =
    'The information in this loan  will automatically create a related receipt. Review the receipt; enter a purpose of receipt or note/memo text; or continue without reviewing and "Save transactions."';
  title = 'Loan Agreement';
  override contactTitle = 'Lender';

  getNewTransaction() {
    return SchC1Transaction.fromJSON({
      form_type: 'SC1/10',
      transaction_type_identifier: ScheduleC1TransactionTypes.C1_LOAN_AGREEMENT,
    });
  }
}
