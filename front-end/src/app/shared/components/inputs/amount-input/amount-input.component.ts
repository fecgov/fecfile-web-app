import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { InputNumber } from 'primeng/inputnumber';
import { BaseInputComponent } from '../base-input.component';
import { Transaction } from 'app/shared/models/transaction.model';

@Component({
  selector: 'app-amount-input',
  styleUrls: ['./amount-input.component.scss'],
  templateUrl: './amount-input.component.html',
})
export class AmountInputComponent extends BaseInputComponent implements OnInit, OnChanges {
  @Input() contributionAmountReadOnly = false;
  @Input() negativeAmountValueOnly = false;
  @Input() showAggregate = true;

  @Input() memoCodeReadOnly = false;
  @Input() memoItemHelpText =
    'The dollar amount in a memo item is not incorporated into the total figures for the schedule.';
  @Input() transaction: Transaction | undefined;

  @ViewChild('amountInput') amountInput!: InputNumber;

  dateIsOutsideReport = false; // True if transaction date is outside the report dates
  contributionAmountInputStyleClass = '';

  constructor(private changeDetectorRef: ChangeDetectorRef, private store: Store) {
    super();
  }

  ngOnInit(): void {
    if (this.contributionAmountReadOnly) {
      this.contributionAmountInputStyleClass = 'readonly';
    }
  }

  ngOnChanges(): void {
    this.changeDetectorRef.detectChanges();
  }

  onInputAmount() {
    if (this.negativeAmountValueOnly) {
      // Automatically convert the amount value to a negative dollar amount.
      const inputValue = this.amountInput.input.nativeElement.value;
      if (inputValue.startsWith('$')) {
        const value = Number(parseInt(inputValue.slice(1)).toFixed(2));
        this.amountInput.updateInput(-1 * value, undefined, 'insert', undefined);
      }
    }
  }
}
