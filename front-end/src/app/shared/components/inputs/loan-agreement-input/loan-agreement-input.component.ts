import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BaseInputComponent } from '../base-input.component';
import { takeUntil } from 'rxjs';
import { SelectItem } from 'primeng/api';
import { Contact, ContactTypes } from 'app/shared/models/contact.model';
import { getContactTypeOptions } from 'app/shared/utils/transaction-type-properties';
import { ORGANIZATION } from 'app/shared/utils/transaction-type-properties';
import { PrimeOptions } from 'app/shared/utils/label.utils';

@Component({
  selector: 'app-loan-agreement-input',
  templateUrl: './loan-agreement-input.component.html',
  styleUrls: ['./loan-agreement-input.component.scss'],
})
export class LoanAgreementInputComponent extends BaseInputComponent implements OnInit {
  @Output() contactSelect = new EventEmitter<SelectItem<Contact>>();

  // Switches to show/hide groups of form input values
  showLoanRestructured = false;
  showLineOfCredit = false;
  showOthersLiable = false;
  showSecured = false;
  showFutureIncome = false;

  contactTypeFormControl: FormControl = new FormControl(ContactTypes.ORGANIZATION);
  contactTypeOptions: PrimeOptions = getContactTypeOptions(ORGANIZATION);

  ngOnInit(): void {
    // Make a placeholder form control for line of credit Yes/No radio buttons,
    // which is not in the spec and its value is not saved in the transaction.
    this.form.addControl('lineOfCredit', new FormControl(null));

    this.form
      .get('loan_restructured')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.showLoanRestructured = value;
        if (!value) {
          this.form.get('loan_originally_incurred_date')?.setValue(null);
        }
      });

    this.form
      .get('lineOfCredit')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.showLineOfCredit = value;
        if (!value) {
          this.form.patchValue({
            credit_amount_this_draw: null,
            [this.templateMap['balance']]: null,
          });
        }
      });

    this.form
      .get('others_liable')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.showOthersLiable = value;
      });

    this.form
      .get(this.templateMap['secured'])
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.showSecured = value;
        if (!value) {
          this.form.patchValue({
            desc_collateral: null,
            collateral_value_amount: null,
            perfected_interest: null,
          });
        }
      });

    this.form
      .get('future_income')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.showFutureIncome = value;
        if (!value) {
          this.form.patchValue({
            desc_specification_of_the_above: null,
            estimated_value: null,
            depository_account_established_date: null,
            [this.templateMap['secondary_name']]: null,
            [this.templateMap['secondary_street_1']]: null,
            [this.templateMap['secondary_street_2']]: null,
            [this.templateMap['secondary_city']]: null,
            [this.templateMap['secondary_state']]: null,
            [this.templateMap['secondary_zip']]: null,
          });
        }
      });
  }

  updateFormWithPrimaryContact(selectItem: SelectItem<Contact>) {
    this.contactSelect.emit(selectItem);
  }
}
