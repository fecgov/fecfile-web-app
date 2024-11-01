import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DestroyerComponent } from 'app/shared/components/app-destroyer.component';
import { CashOnHandService } from 'app/shared/services/cash-on-hand-service';
import { Form3XService } from 'app/shared/services/form-3x.service';
import { MessageService } from 'primeng/api';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-cash-on-hand-override',
  templateUrl: './cash-on-hand-override.component.html',
})
export class CashOnHandOverrideComponent extends DestroyerComponent implements OnInit {
  yearFormControl = new FormControl<string | null>(null, Validators.required);
  currentAmountFormControl = new FormControl<number | null>(null, Validators.required);
  newAmountFormControl = new FormControl<number | null>(null, Validators.required);
  yearOptions: string[] = [];
  numberOfYearOptions = 25;

  form: FormGroup = new FormGroup({
    year: this.yearFormControl,
    currentAmount: this.currentAmountFormControl,
    newAmount: this.newAmountFormControl,
  });

  constructor(
    private readonly router: Router,
    private readonly messageService: MessageService,
    public cashOnHandService: CashOnHandService,
    public form3XService: Form3XService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.yearFormControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((selectedYear) => {
      if (selectedYear) {
        const year = parseInt(String(selectedYear));
        const override = this.cashOnHandService.getCashOnHand(year);
        const previousYear = this.form3XService.getFinalReport(year - 1);
        // reset while waiting for api response
        this.currentAmountFormControl.reset();
        this.newAmountFormControl.reset();
        Promise.all([override, previousYear]).then(([cashOnHandOverride, previousYear]) => {
          this.currentAmountFormControl.setValue(
            cashOnHandOverride?.cash_on_hand ?? previousYear?.L8_cash_on_hand_close_ytd ?? 0,
          );
          this.newAmountFormControl.reset();
        });
      }
    });

    const currentYear = new Date().getFullYear();
    this.yearOptions = Array.from({ length: this.numberOfYearOptions }, (value, index) =>
      (currentYear - index).toString(),
    );
    this.yearFormControl.setValue(this.yearOptions[0]);
  }

  updateLine6a(): void {
    if (this.form.valid) {
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
