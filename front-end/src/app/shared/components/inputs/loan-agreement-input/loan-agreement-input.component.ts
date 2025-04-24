import { Component, computed, effect, output } from '@angular/core';
import { BaseInputComponent } from '../base-input.component';
import { SelectItem } from 'primeng/api';
import { Contact } from 'app/shared/models/contact.model';
import { getContactTypeOptions, ORGANIZATION } from 'app/shared/utils/transaction-type-properties';
import { PrimeOptions } from 'app/shared/utils/label.utils';
import { ReactiveFormsModule } from '@angular/forms';
import { ErrorMessagesComponent } from '../../error-messages/error-messages.component';
import { LoanTermsDatesInputComponent } from '../loan-terms-dates-input/loan-terms-dates-input.component';
import { YesNoRadioInputComponent } from '../yes-no-radio-input/yes-no-radio-input.component';
import { CalendarComponent } from '../../calendar/calendar.component';
import { Tooltip } from 'primeng/tooltip';
import { TransactionContactLookupComponent } from '../../transaction-contact-lookup/transaction-contact-lookup.component';
import { InputText } from 'primeng/inputtext';
import { AddressInputComponent } from '../address-input/address-input.component';
import { TextareaModule } from 'primeng/textarea';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-loan-agreement-input',
  templateUrl: './loan-agreement-input.component.html',
  imports: [
    ReactiveFormsModule,
    ErrorMessagesComponent,
    LoanTermsDatesInputComponent,
    YesNoRadioInputComponent,
    CalendarComponent,
    Tooltip,
    TransactionContactLookupComponent,
    InputText,
    AddressInputComponent,
    InputNumberModule,
    TextareaModule,
  ],
})
export class LoanAgreementInputComponent extends BaseInputComponent {
  contactSelect = output<SelectItem<Contact>>();

  // Switches to show/hide groups of form input values
  readonly showLoanRestructured = computed(() => this.getControl('loan_restructured')?.valueChangeSignal() === true);
  readonly showLineOfCredit = computed(() => !!this.getControl('line_of_credit')?.valueChangeSignal());
  readonly showOthersLiable = computed(() => !!this.getControl('others_liable')?.valueChangeSignal());
  readonly showSecured = computed(() => !!this.getControl(this.templateMap()['secured'])?.valueChangeSignal());
  readonly showFutureIncome = computed(() => !!this.getControl('future_income')?.valueChangeSignal());
  readonly showLocationOfAccount = computed(() => !!this.getControl(this.templateMap()['secondary_name']));

  readonly contactTypeOptions: PrimeOptions = getContactTypeOptions(ORGANIZATION); // Options for contact lookup component

  locationOfAccountHelpText =
    'Provide the full name and address of the depository institution where the account was established.';

  constructor() {
    super();
    effect(() => {
      const value = this.getControl('loan_restructured')?.valueChangeSignal();
      if (!value) {
        this.form().get('loan_originally_incurred_date')?.setValue(null);
      }
    });

    effect(() => {
      const value = this.getControl('line_of_credit')?.valueChangeSignal();
      if (!value) {
        this.form().patchValue({
          credit_amount_this_draw: null,
          [this.templateMap()['balance']]: null,
        });
      }
    });

    // We need to update the TOTAL OUTSTANDING BALANCE field when
    // the CREDIT AMOUNT THIS DRAW field is updated to ensure validation
    // keeps in the former keeps up with changes in the latter.
    effect(() => {
      this.getControl('credit_amount_this_draw')?.valueChangeSignal();
      this.form().get(this.templateMap()['balance'])?.updateValueAndValidity();
    });

    effect(() => {
      const value = this.getControl(this.templateMap()['secured'])?.valueChangeSignal();
      if (!value) {
        this.form().patchValue({
          desc_collateral: null,
          collateral_value_amount: null,
          perfected_interest: null,
        });
      }
    });

    effect(() => {
      const value = this.getControl('future_income')?.valueChangeSignal();
      if (!value) {
        this.form().patchValue({
          desc_specification_of_the_above: null,
          estimated_value: null,
          depository_account_established_date: null,
          [this.templateMap()['secondary_name']]: null,
          [this.templateMap()['secondary_street_1']]: null,
          [this.templateMap()['secondary_street_2']]: null,
          [this.templateMap()['secondary_city']]: null,
          [this.templateMap()['secondary_state']]: null,
          [this.templateMap()['secondary_zip']]: null,
        });
      }
    });

    // this.form().get('loan_restructured')?.updateValueAndValidity();
    // this.form().get('line_of_credit')?.updateValueAndValidity();
    // this.form().get('others_liable')?.updateValueAndValidity();
    // this.form().get(this.templateMap()['secured'])?.updateValueAndValidity();
    // this.form().get('future_income')?.updateValueAndValidity();
    // this.form().get(this.templateMap()['secondary_name'])?.updateValueAndValidity();
  }

  updateFormWithLocationOfAccountContact(selectItem: SelectItem<Contact>) {
    this.contactSelect.emit(selectItem);
  }
}
