import { Component, Input } from '@angular/core';
import { BaseInputComponent } from '../base-input.component';
import { Transaction } from 'app/shared/models/transaction.model';

@Component({
  selector: 'app-loan-terms-input',
  templateUrl: './loan-terms-input.component.html',
})
export class LoanTermsInputComponent extends BaseInputComponent {
  @Input() transaction?: Transaction;
}
