import { Component, computed, input } from '@angular/core';
import { takeUntil } from 'rxjs';
import { BaseInputComponent } from '../base-input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ErrorMessagesComponent } from '../../error-messages/error-messages.component';
import { MemoCodeInputComponent } from '../memo-code/memo-code.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { effectOnceIf } from 'ngxtension/effect-once-if';
import { SignalFormControl } from 'app/shared/utils/signal-form-control';

@Component({
  selector: 'app-loan-info-input',
  templateUrl: './loan-info-input.component.html',
  imports: [ReactiveFormsModule, InputNumberModule, ErrorMessagesComponent, MemoCodeInputComponent],
})
export class LoanInfoInputComponent extends BaseInputComponent {
  readonly readonly = input(false);
  readonly memoItemHelpText = input<string>();

  readonly paymentControl = computed(() => {
    const control = this.form().get(this.templateMap().payment_to_date);
    if (control) {
      if (!this.transaction()?.id || !control.value) {
        control.setValue(0);
      }
    }
    return control;
  });

  readonly amountControl = computed(() => this.form().get(this.templateMap().amount) as SignalFormControl);
  readonly balanceControl = computed(() => this.form().get(this.templateMap().balance) as SignalFormControl);
  readonly paymentToDateControl = computed(
    () => this.form().get(this.templateMap().payment_to_date) as SignalFormControl,
  );

  constructor() {
    super();
    effectOnceIf(
      () => this.amountControl(),
      () => {
        // balance is a calculated field and not saved to the database
        this.amountControl()
          .valueChanges.pipe(takeUntil(this.destroy$))
          .subscribe((amount) => {
            let balance = amount;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const payment_to_date = (<any>this.transaction())[this.templateMap().payment_to_date];
            if (payment_to_date) {
              balance = amount - payment_to_date;
            }
            this.form().get(this.templateMap().balance)?.setValue(balance);
          });
      },
    );
  }
}
