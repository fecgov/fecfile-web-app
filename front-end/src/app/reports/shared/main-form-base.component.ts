import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { SchemaUtils } from 'app/shared/utils/schema.utils';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { selectCommitteeAccount } from 'app/store/committee-account.selectors';
import { MessageService } from 'primeng/api';
import { Observable, combineLatest, takeUntil } from 'rxjs';
import { DestroyerComponent } from 'app/shared/components/app-destroyer.component';
import { CommitteeAccount } from 'app/shared/models/committee-account.model';
import { Report } from 'app/shared/models/report.model';
import { singleClickEnableAction } from 'app/store/single-click.actions';
import { ReportService } from 'app/shared/services/report.service';
import { JsonSchema } from 'app/shared/interfaces/json-schema.interface';

@Component({
  template: '',
})
export abstract class MainFormBaseComponent extends DestroyerComponent implements OnInit {
  abstract formProperties: string[];
  abstract schema: JsonSchema;
  abstract getReportPayload(): Report;
  abstract webprintURL: string;

  formSubmitted = false;
  form: FormGroup = new FormGroup({});
  reportId?: string;

  constructor(
    protected store: Store,
    protected fb: FormBuilder,
    protected reportService: ReportService,
    protected messageService: MessageService,
    protected router: Router,
    protected activatedRoute: ActivatedRoute,
  ) {
    super();
  }

  ngOnInit(): void {
    this.reportId = this.activatedRoute.snapshot.params['reportId'];
    this.form = this.fb.group(SchemaUtils.getFormGroupFields(this.formProperties));
    const activeReport$ = this.store.select(selectActiveReport).pipe(takeUntil(this.destroy$));
    const committeeAccount$ = this.store.select(selectCommitteeAccount).pipe(takeUntil(this.destroy$));

    combineLatest([activeReport$, committeeAccount$]).subscribe(([activeReport, committeeAccount]) => {
      this.setConstantFormValues(committeeAccount);
      if (this.reportId) {
        this.form.patchValue(activeReport);
      }
    });

    SchemaUtils.addJsonSchemaValidators(this.form, this.schema, false);
  }

  setConstantFormValues(committeeAccount: CommitteeAccount) {
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

  public save(jump: 'continue' | undefined = undefined) {
    this.formSubmitted = true;

    if (this.form.invalid) {
      this.store.dispatch(singleClickEnableAction());
      return;
    }

    const payload: Report = this.getReportPayload();
    let save$: Observable<Report>;
    if (this.reportId) {
      payload.id = this.reportId;
      save$ = this.reportService.update(payload, this.formProperties);
    } else {
      save$ = this.reportService.create(payload, this.formProperties);
    }

    save$.pipe(takeUntil(this.destroy$)).subscribe((report: Report) => {
      if (jump === 'continue') {
        this.router.navigateByUrl(this.webprintURL + report.id);
      } else {
        this.router.navigateByUrl('/reports');
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Form saved',
          life: 3000,
        });
      }
    });
  }
}
