import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DestroyerComponent } from 'app/shared/components/app-destroyer.component';
import { F3xLine6aOverride } from 'app/shared/models/form-3x.model';
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
  selectedF3xLine6aOverrideId?: string;

  form: FormGroup = new FormGroup({
    year: this.yearFormControl,
    currentAmount: this.currentAmountFormControl,
    newAmount: this.newAmountFormControl,
  });

  constructor(
    private readonly router: Router,
    private readonly messageService: MessageService,
    public form3XService: Form3XService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.yearFormControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((selectedYear) => {
      if (selectedYear) {
        this.form3XService.getF3xLine6aOverride(selectedYear).then((f3xLine6aOverride) => {
          this.selectedF3xLine6aOverrideId = f3xLine6aOverride?.id;
          this.currentAmountFormControl.setValue(f3xLine6aOverride?.cash_on_hand ?? 0);
          this.newAmountFormControl.setValue(0);
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
      if (this.yearFormControl.value && this.newAmountFormControl.value) {
        const payload = new F3xLine6aOverride();
        payload.id = this.selectedF3xLine6aOverrideId;
        payload.year = this.yearFormControl.value;
        payload.cash_on_hand = this.newAmountFormControl.value;
        this.savePayload(payload).then(() => {
          this.router.navigate(['reports']);
        });
      }
    }
  }

  savePayload(payload: F3xLine6aOverride) {
    if (payload.id) {
      return this.form3XService.updateF3xLine6aOverride(payload).then(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Cash On Hand Updated',
          life: 3000,
        });
      });
    } else {
      return this.form3XService.createF3xLine6aOverride(payload).then(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Cash On Hand Created',
          life: 3000,
        });
      });
    }
  }
}
