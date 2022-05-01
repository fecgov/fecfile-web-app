import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { mergeMap, Observable, of } from 'rxjs';
import { LabelUtils, PrimeOptions, StatesCodeLabels, CountryCodeLabels } from 'app/shared/utils/label.utils';
import { ValidateService } from 'app/shared/services/validate.service';
import { schema as f3xSchema } from 'fecfile-validate/fecfile_validate_js/dist/F3X';
import { F3xSummary } from 'app/shared/models/f3x-summary.model';
import { F3xSummaryService } from 'app/shared/services/f3x-summary.service';

@Component({
  selector: 'app-create-f3x-step2',
  templateUrl: './create-f3x-step2.component.html',
  styleUrls: ['./create-f3x-step2.component.scss'],
})
export class CreateF3xStep2Component implements OnInit {
  report: F3xSummary | null = null;
  formProperties: string[] = [
    'change_of_address',
    'street_1',
    'street_2',
    'city',
    'state',
    'zip',
    'memo_checkbox',
    'memo',
  ];
  stateOptions: PrimeOptions = [];
  countryOptions: PrimeOptions = [];
  formSubmitted = false;

  form: FormGroup = this.fb.group(this.validateService.getFormGroupFields(this.formProperties));

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private reportService: F3xSummaryService,
    private validateService: ValidateService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.stateOptions = LabelUtils.getPrimeOptions(StatesCodeLabels);
    this.countryOptions = LabelUtils.getPrimeOptions(CountryCodeLabels);

    this.route.paramMap
      .pipe(
        // prettier-ignore
        mergeMap((params): Observable<any> => { // eslint-disable-line @typescript-eslint/no-explicit-any
          const id: string | null = params.get('id');
          if (id) {
            return this.reportService.get(id);
          }
          return of(null);
        })
      )
      .subscribe((report: F3xSummary | null) => {
        this.report = report;
        this.form.patchValue({
          change_of_address: !!this.report?.change_of_address,
        });
      });

    // Initialize validation tracking of current JSON schema and form data
    this.validateService.formValidatorSchema = f3xSchema;
    this.validateService.formValidatorForm = this.form;
  }

  public save() {
    this.formSubmitted = true;

    if (this.form.invalid) {
      return;
    }

    const payload: F3xSummary = F3xSummary.fromJSON({
      ...this.report,
      ...this.validateService.getFormValues(this.form),
    });

    console.log(payload);

    // this.reportService.update(payload).subscribe();
  }
}
