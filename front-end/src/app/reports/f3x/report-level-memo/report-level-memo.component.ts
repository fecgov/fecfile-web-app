import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { F3xSummary } from 'app/shared/models/f3x-summary.model';
import { MemoText } from 'app/shared/models/memo-text.model';
import { MemoTextService } from 'app/shared/services/memo-text.service';
import { ValidateService } from 'app/shared/services/validate.service';
import { selectCommitteeAccount } from 'app/store/committee-account.selectors';
import { selectReportCodeLabelList } from 'app/store/label-lookup.selectors';
import { schema as textSchema } from 'fecfile-validate/fecfile_validate_js/dist/Text';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { ReportCodeLabelList } from '../../../shared/utils/reportCodeLabels.utils';

@Component({
  selector: 'app-report-level-memo',
  templateUrl: './report-level-memo.component.html',
  styleUrls: ['../../styles.scss'],
})
export class ReportLevelMemoComponent implements OnInit {
  readonly recTypeFormProperty = 'rec_type';
  readonly committeeIdFormProperty = 'filer_committee_id_number';
  readonly brSchedFormProperty = 'back_reference_sched_form_name';
  readonly text4kFormProperty = 'text4000';

  formProperties: string[] = [
    this.recTypeFormProperty,
    this.committeeIdFormProperty,
    this.brSchedFormProperty,
    this.text4kFormProperty,
  ];

  report: F3xSummary = new F3xSummary();
  reportCodeLabelList$: Observable<ReportCodeLabelList> = new Observable<ReportCodeLabelList>();
  committeeAccountId: string | null = null;

  assignedMemoText: MemoText = new MemoText();

  formSubmitted = false;
  form: FormGroup = this.fb.group({});
  

  constructor(
    private store: Store, 
    private activatedRoute: ActivatedRoute,
    protected validateService: ValidateService,
    protected fb: FormBuilder,
    public router: Router,
    public memoTextService: MemoTextService,
    private messageService: MessageService
  ) {
    this.form.addControl(this.recTypeFormProperty, new FormControl());
    this.form.addControl(this.committeeIdFormProperty, new FormControl());
    this.form.addControl(this.brSchedFormProperty, new FormControl());
  }

  ngOnInit(): void {
    // Intialize FormGroup, this must be done here. Not working when initialized only above the constructor().
    this.form = this.fb.group(this.validateService.getFormGroupFields(this.formProperties));

    // Initialize validation tracking of current JSON schema and form data
    this.validateService.formValidatorSchema = textSchema;
    this.validateService.formValidatorForm = this.form;

    this.reportCodeLabelList$ = this.store.select<ReportCodeLabelList>(selectReportCodeLabelList);
    this.store.select(selectCommitteeAccount).subscribe(committeeAccount => 
      this.committeeAccountId = committeeAccount.committee_id);
    this.report = this.activatedRoute.snapshot.data['report'];
    if (this.report && this.report.id) {
      this.memoTextService.getForReportId(this.report.id).subscribe(memoTextList => {
        if (memoTextList && memoTextList.length > 0) {
          this.assignedMemoText = memoTextList[0];
          this.form.get(this.text4kFormProperty)?.setValue(
            this.assignedMemoText.text4000);
        }
      });
    }
  }

  save() {
    this.formSubmitted = true;

    this.form.get(this.recTypeFormProperty)?.setValue('TEXT');
    this.form.get(this.committeeIdFormProperty)?.setValue(
      this.committeeAccountId);
    this.form.get(this.brSchedFormProperty)?.setValue(
      this.report.form_type);

    const payload: MemoText = MemoText.fromJSON({
      ...this.assignedMemoText,
      ...this.validateService.getFormValues(this.form, this.formProperties),
    });
    payload.report_id = this.report.id;

    if (this.assignedMemoText.id) {
      this.memoTextService.update(payload, this.formProperties).subscribe(() => {
        this.router.navigateByUrl('/reports');
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Report Memo Updated',
          life: 3000,
        });
      });
    } else {
      this.memoTextService.create(payload, this.formProperties).subscribe(() => {
        this.router.navigateByUrl('/reports');
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Report Memo Created',
          life: 3000,
        });
      });
    }
  }

}
