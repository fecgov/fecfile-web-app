import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Transaction } from 'app/shared/models/transaction.model';
import { InputNumber } from 'primeng/inputnumber';
import { BaseInputComponent } from '../base-input.component';

@Component({
  selector: 'app-amount-input',
  styleUrls: ['./amount-input.component.scss'],
  templateUrl: './amount-input.component.html',
})
export class AmountInputComponent extends BaseInputComponent implements OnInit, OnChanges {
  @Input() contributionAmountReadOnly = false;
  @Input() negativeAmountValueOnly = false;
  @Input() showAggregate = true;

  @Input() memoCodeCheckboxLabel = '';
  @Input() memoItemHelpText: string | undefined;
  @Input() transaction: Transaction | undefined;

  @ViewChild('amountInput') amountInput!: InputNumber;

  dateIsOutsideReport = false; // True if transaction date is outside the report dates
  contributionAmountInputStyleClass = '';
  showDate = true;
  showMemo = true;

  constructor(private changeDetectorRef: ChangeDetectorRef, private store: Store) {
    super();
  }

  ngOnInit(): void {
    if (this.contributionAmountReadOnly) {
      this.contributionAmountInputStyleClass = 'readonly';
    }
    this.showDate = !!this.transaction?.transactionType.hasDate();
    this.showMemo = !!this.transaction?.transactionType.hasMemoCode();
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
