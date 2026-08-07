import type { FormGroup } from '@angular/forms';
import {
  ADDRESS_FIELDS,
  LOAN_TERMS_FIELDS,
  ORGANIZATION,
  ORG_FIELDS,
  SECONDARY_ADDRESS_FIELDS,
  SIGNATORY_1_FIELDS,
  SIGNATORY_2_FIELDS,
} from 'app/shared/utils/transaction-type-properties';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/C1_LOAN_AGREEMENT';
import { STANDARD_AND_SECONDARY } from '../contacts/contact.model';
import { SchC1TransactionType } from '../transaction/schedule-c1/schc1-transaction-type.model';
import { SchC1Transaction } from '../transaction/schedule-c1/schc1-transaction.model';
import type { TemplateMapKeyType } from '../transaction/transaction-type.model';
import type { Transaction } from '../transaction/transaction.model';
import { isPulledForwardLoan } from '../transaction/transaction-model.utils';
import { ScheduleC1TransactionTypes } from '../transaction/schedule-c1/schedule-c1-transaction-types.model';

export class C1_LOAN_AGREEMENT extends SchC1TransactionType {
  formFields = [
    ...ORG_FIELDS,
    ...LOAN_TERMS_FIELDS,
    ...SECONDARY_ADDRESS_FIELDS,
    ...SIGNATORY_1_FIELDS,
    ...SIGNATORY_2_FIELDS,
    ...ADDRESS_FIELDS,
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
  override isDependentChild = (transaction: Transaction) => !isPulledForwardLoan(transaction.parent_transaction);
  override doMemoCodeDateCheck = false;
  schema = schema;
  override useParentContact = true;
  override hasAmountInput = false;
  override hasLoanAgreement = true;
  override hasAdditionalInfo = false;
  override signatoryOneHeader = 'Committee treasurer';
  override signatoryTwoHeader = 'Bank authorized representative';
  override populateSignatoryOneWithTreasurer = true;
  override showParentTransactionTitle = true;

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
    'loan_due_date_is_date',
    'interest_rate',
    'loan_interest_rate_is_percent',
  ] as TemplateMapKeyType[];

  // override description =
  //   'Only the Purpose of Receipt and Note/Memo Text are editable. To update any errors found, return to the previous step to update loan information.';
  override accordionTitle = 'STEP TWO';
  override accordionSubText =
    'Enter contact, loan, terms, collateral, and future income information for the loan agreement';
  override formTitle = 'Receipt';
  override footer =
    'The information in this loan  will automatically create a related receipt. Review the receipt; enter a purpose of receipt or note/memo text; or continue without reviewing and "Save transactions."';
  title = 'Loan agreement';
  override contactTitle = 'Lender';

  getNewTransaction() {
    return SchC1Transaction.fromJSON({
      form_type: 'SC1/10',
      transaction_type_identifier: ScheduleC1TransactionTypes.C1_LOAN_AGREEMENT,
    });
  }
}
