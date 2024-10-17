import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DestroyerComponent } from 'app/shared/components/app-destroyer.component';
import { Form3XService } from 'app/shared/services/form-3x.service';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-cash-on-hand-override',
  templateUrl: './cash-on-hand-override.component.html',
  styleUrls: ['./cash-on-hand-override.component.scss'],
})
export class CashOnHandOverrideComponent extends DestroyerComponent implements OnInit {
  yearFormControl = new FormControl<number | null>(null, Validators.required);
  currentAmountFormControl = new FormControl<number | null>(null, Validators.required);
  newAmountFormControl = new FormControl<number | null>(null, Validators.required);
  yearOptions: number[] = [];
  numberOfYearOptions = 25

  form: FormGroup = new FormGroup({
    year: this.yearFormControl,
    currentAmount: this.currentAmountFormControl,
    newAmount: this.newAmountFormControl,
  });

  constructor(
    private form3XService: Form3XService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.yearFormControl.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((year) => {
        if (year) {
          this.form3XService.getJan1CashOnHand(year).then(cashOnHandForYear => {
            this.currentAmountFormControl.setValue(cashOnHandForYear);
          });
        }
      });

    const currentYear = new Date().getFullYear();
    this.yearOptions = Array.from(
      { length: this.numberOfYearOptions },
      (value, index) => currentYear - this.numberOfYearOptions + index
    );
    this.yearFormControl.setValue(this.yearOptions[this.yearOptions.length - 1]);
  }

  updateLine6a(): void {
    if (this.form.valid) {
      this.form3XService.updateJan1CashOnHand(this.form.get('year')?.value,
        this.form.get('amount')?.value).then(() => { });
    }
  }
}
