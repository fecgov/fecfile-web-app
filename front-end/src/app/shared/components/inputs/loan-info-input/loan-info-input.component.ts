import { Component, Input, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs';
import { BaseInputComponent } from '../base-input.component';
import { Transaction } from 'app/shared/models/transaction.model';

@Component({
  selector: 'app-loan-info-input',
  templateUrl: './loan-info-input.component.html',
})
export class LoanInfoInputComponent extends BaseInputComponent {
  @Input() readonly = false;

  @Input() memoItemHelpText: string | undefined;
  @Input() transaction: Transaction | undefined;
}
