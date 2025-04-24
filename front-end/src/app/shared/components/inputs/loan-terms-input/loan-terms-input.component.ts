import { Component } from '@angular/core';
import { BaseTransactionInputComponent } from '../base-input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoanTermsDatesInputComponent } from '../loan-terms-dates-input/loan-terms-dates-input.component';
import { YesNoRadioInputComponent } from '../yes-no-radio-input/yes-no-radio-input.component';

@Component({
  selector: 'app-loan-terms-input',
  templateUrl: './loan-terms-input.component.html',
  imports: [ReactiveFormsModule, LoanTermsDatesInputComponent, YesNoRadioInputComponent],
})
export class LoanTermsInputComponent extends BaseTransactionInputComponent {}
