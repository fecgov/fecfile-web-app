import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { DestroyerComponent } from 'app/shared/components/app-destroyer.component';
import { Form3X } from 'app/shared/models/form-3x.model';
import { Form3XService } from 'app/shared/services/form-3x.service';
import { ValidateUtils } from 'app/shared/utils/validate.utils';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { schema as f3xSchema } from 'fecfile-validate/fecfile_validate_js/dist/F3X';
import { MessageService } from 'primeng/api';
import { takeUntil } from 'rxjs';
import { spinnerOffAction } from "../../../store/spinner.actions";

@Component({
  selector: 'app-cash-on-hand',
  templateUrl: './cash-on-hand.component.html',
})
export class CashOnHandComponent extends DestroyerComponent implements OnInit {
  formProperties: string[] = ['L6a_cash_on_hand_jan_1_ytd', 'cash_on_hand_date'];
  report: Form3X | undefined;
  formSubmitted = false;
  form: FormGroup = this.fb.group(ValidateUtils.getFormGroupFields(this.formProperties));

  constructor(
    public router: Router,
    private form3XService: Form3XService,
    private fb: FormBuilder,
    private messageService: MessageService,
    public store: Store
  ) {
    super();
  }

  ngOnInit(): void {
    this.store
      .select(selectActiveReport)
      .pipe(takeUntil(this.destroy$))
      .subscribe((report) => (this.report = report as Form3X));

    // Initialize validation tracking of current JSON schema and form data
    this.form.controls['L6a_cash_on_hand_jan_1_ytd'].addValidators([Validators.required]);
    this.form.controls['cash_on_hand_date'].addValidators([Validators.required]);

    // Set form default values
    this.form.patchValue({...this.report});
  }

  public save(): void {
    this.formSubmitted = true;
    if (this.form.invalid) {
      this.store.dispatch(spinnerOffAction());
      return;
    }

    const payload: Form3X = Form3X.fromJSON({
      ...this.report,
      ...ValidateUtils.getFormValues(this.form, f3xSchema, this.formProperties),
      ...{
        calculation_status: null,
        cash_on_hand_date: this.form.controls['cash_on_hand_date'].value,
        L6a_year_for_above_ytd: String(this.form.controls['cash_on_hand_date'].value.getYear() + 1900),
      },
    });

    this.form3XService.update(payload, false, this.formProperties).subscribe(() => {
      this.store.dispatch(spinnerOffAction());
      if (this.report) {
        this.router.navigateByUrl(`/reports/transactions/report/${this.report.id}/list`);
      }

      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Report Updated',
        life: 3000,
      });
    });
  }
}
