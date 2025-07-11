import { Component, effect, inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormComponent } from 'app/shared/components/app-destroyer.component';
import { CommitteeAccount } from 'app/shared/models/committee-account.model';
import { Report } from 'app/shared/models/report.model';
import { ReportService } from 'app/shared/services/report.service';
import { blurActiveInput } from 'app/shared/utils/form.utils';
import { SchemaUtils } from 'app/shared/utils/schema.utils';
import { singleClickEnableAction } from 'app/store/single-click.actions';
import { JsonSchema } from 'fecfile-validate';
import { MessageService } from 'primeng/api';
import { firstValueFrom } from 'rxjs';
@Component({
  template: '',
})
export abstract class MainFormBaseComponent extends FormComponent implements OnInit {
  protected abstract reportService: ReportService;
  protected readonly messageService = inject(MessageService);
  protected readonly router = inject(Router);
  protected readonly activatedRoute = inject(ActivatedRoute);
  abstract readonly formProperties: string[];
  abstract readonly schema: JsonSchema;
  abstract getReportPayload(): Report;
  abstract webprintURL: string;

  form: FormGroup = new FormGroup({}, { updateOn: 'blur' });
  reportId?: string;

  constructor() {
    super();

    effect(() => {
      this.setConstantFormValues(this.committeeAccount());
      if (this.reportId) {
        this.form.patchValue(this.activeReport());
      }
    });
  }

  ngOnInit(): void {
    this.reportId = this.activatedRoute.snapshot.params['reportId'];
    this.form = this.fb.group(SchemaUtils.getFormGroupFieldsNoBlur(this.formProperties), { updateOn: 'blur' });
    SchemaUtils.addJsonSchemaValidators(this.form, this.schema, false);
  }

  setConstantFormValues(committeeAccount?: CommitteeAccount) {
    if (!committeeAccount) return;
    this.form.patchValue({
      street_1: committeeAccount.street_1,
      street_2: committeeAccount.street_2,
      city: committeeAccount.city,
      state: committeeAccount.state,
      zip: committeeAccount.zip,
      filer_committee_id_number: committeeAccount.committee_id,
      committee_name: committeeAccount.name,
    });
  }

  public goBack() {
    this.router.navigateByUrl('/reports');
  }

  public async save(jump: 'continue' | undefined = undefined) {
    this.formSubmitted = true;
    blurActiveInput(this.form);

    // If the form is still processing validity, wait for it to finish
    if (this.form.pending) {
      await firstValueFrom(this.form.statusChanges);
    }

    if (this.form.invalid) {
      this.store.dispatch(singleClickEnableAction());
      return;
    }

    const payload: Report = this.getReportPayload();
    let report: Report;
    if (this.reportId) {
      payload.id = this.reportId;
      report = await this.reportService.update(payload, this.formProperties);
    } else {
      report = await this.reportService.create(payload, this.formProperties);
    }

    if (jump === 'continue') {
      await this.router.navigateByUrl(this.webprintURL + report.id);
    } else {
      await this.router.navigateByUrl('/reports');
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Form saved',
        life: 3000,
      });
    }
  }
}
