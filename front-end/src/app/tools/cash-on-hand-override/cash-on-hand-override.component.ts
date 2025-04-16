import { Component, inject, OnInit, signal } from '@angular/core';
import { FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DestroyerComponent, FormComponent } from 'app/shared/components/app-destroyer.component';
import { CashOnHand } from 'app/shared/models/cash-on-hand.model';
import { Form3X } from 'app/shared/models/form-3x.model';
import { CashOnHandService } from 'app/shared/services/cash-on-hand-service';
import { Form3XService } from 'app/shared/services/form-3x.service';
import { SignalFormControl } from 'app/shared/utils/signal-form-control';
import { MessageService } from 'primeng/api';
import { takeUntil } from 'rxjs';
import { Select } from 'primeng/select';
import { ButtonDirective } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-cash-on-hand-override',
  templateUrl: './cash-on-hand-override.component.html',
  imports: [ReactiveFormsModule, Select, InputNumberModule, ButtonDirective],
})
export class CashOnHandOverrideComponent extends FormComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);
  public readonly cashOnHandService = inject(CashOnHandService);
  public readonly form3XService = inject(Form3XService);
  readonly yearFormControl = new SignalFormControl<string | null>(this.injector, null, Validators.required);
  readonly currentAmountFormControl = new SignalFormControl<number | null>(this.injector, null, Validators.required);
  readonly newAmountFormControl = new SignalFormControl<number | null>(this.injector, null, Validators.required);
  yearOptions: string[] = [];
  numberOfYearOptions = 25;

  form = signal(
    new FormGroup({
      year: this.yearFormControl,
      currentAmount: this.currentAmountFormControl,
      newAmount: this.newAmountFormControl,
    }),
  );

  ngOnInit(): void {
    this.yearFormControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((selectedYear) => {
      if (selectedYear) {
        const year = parseInt(String(selectedYear));
        const override = this.cashOnHandService.getCashOnHand(year);
        const previousYear = this.form3XService.getFinalReport(year - 1);
        // reset while waiting for api response
        this.currentAmountFormControl.reset();
        this.newAmountFormControl.reset();
        Promise.all([override, previousYear]).then(this.updateForm);
      }
    });

    const currentYear = new Date().getFullYear();
    this.yearOptions = Array.from({ length: this.numberOfYearOptions }, (value, index) =>
      (currentYear - index).toString(),
    );
    this.yearFormControl.setValue(this.yearOptions[0]);
  }

  updateForm = ([cashOnHandOverride, previousYear]: [CashOnHand | undefined, Form3X | undefined]): void => {
    this.currentAmountFormControl.setValue(
      cashOnHandOverride?.cash_on_hand ?? previousYear?.L8_cash_on_hand_close_ytd ?? 0,
    );
    this.newAmountFormControl.reset();
  };

  updateLine6a(): void {
    if (this.form().valid) {
      if (this.yearFormControl.value !== null && this.newAmountFormControl.value !== null) {
        const year = parseInt(String(this.yearFormControl.value));
        this.cashOnHandService
          .setCashOnHand(year, this.newAmountFormControl.value)
          .then(() => {
            return this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Cash On Hand Updated',
              life: 3000,
            });
          })
          .then(() => {
            this.router.navigate(['reports']);
          });
      }
    }
  }
}
