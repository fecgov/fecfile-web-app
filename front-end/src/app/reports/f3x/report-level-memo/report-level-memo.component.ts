import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { DestroyerComponent } from 'app/shared/components/app-destroyer.component';
import { Form3X } from 'app/shared/models/form-3x.model';
import { MemoText } from 'app/shared/models/memo-text.model';
import { MemoTextService } from 'app/shared/services/memo-text.service';
import { ValidateUtils } from 'app/shared/utils/validate.utils';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { selectCommitteeAccount } from 'app/store/committee-account.selectors';
import { schema as textSchema } from 'fecfile-validate/fecfile_validate_js/dist/Text';
import { MessageService } from 'primeng/api';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-report-level-memo',
  templateUrl: './report-level-memo.component.html',
  styleUrls: ['../../styles.scss'],
})
export class ReportLevelMemoComponent extends DestroyerComponent implements OnInit {
  readonly recTypeFormProperty = 'rec_type';
  readonly text4kFormProperty = 'text4000';

  formProperties: string[] = [this.recTypeFormProperty, this.text4kFormProperty];

  report: Form3X = new Form3X();
  committeeAccountId: string | undefined;

  assignedMemoText: MemoText = new MemoText();

  formSubmitted = false;
  form: FormGroup = this.fb.group({});

  constructor(
    private store: Store,
    protected fb: FormBuilder,
    public router: Router,
    public memoTextService: MemoTextService,
    private messageService: MessageService
  ) {
    super();
    this.form.addControl(this.recTypeFormProperty, new FormControl());
  }

  ngOnInit(): void {
    // Intialize FormGroup, this must be done here. Not working when initialized only above the constructor().
    this.form = this.fb.group(ValidateUtils.getFormGroupFields(this.formProperties));

    this.store
      .select(selectCommitteeAccount)
      .pipe(takeUntil(this.destroy$))
      .subscribe((committeeAccount) => (this.committeeAccountId = committeeAccount?.committee_id));

    this.store
      .select(selectActiveReport)
      .pipe(takeUntil(this.destroy$))
      .subscribe((report) => {
        this.report = report as Form3X;
        if (this.report && this.report.id) {
          this.memoTextService.getForReportId(this.report.id).subscribe((memoTextList) => {
            if (memoTextList && memoTextList.length > 0) {
              this.assignedMemoText = memoTextList[0];
              this.form.get(this.text4kFormProperty)?.setValue(this.assignedMemoText.text4000);
            }
          });
        }
      });

    ValidateUtils.addJsonSchemaValidators(this.form, textSchema, false);
  }

  save() {
    this.formSubmitted = true;

    this.form.get(this.recTypeFormProperty)?.setValue('TEXT');

    const payload: MemoText = MemoText.fromJSON({
      ...this.assignedMemoText,
      ...ValidateUtils.getFormValues(this.form, textSchema, this.formProperties),
    });
    payload.report_id = this.report.id;

    const nextUrl = `/reports/f3x/submit/step1/${this.report.id}`;

    if (this.assignedMemoText.id) {
      this.memoTextService.update(payload, this.formProperties).subscribe(() => {
        this.router.navigateByUrl(nextUrl);
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Report Memo Updated',
          life: 3000,
        });
      });
    } else {
      this.memoTextService.create(payload, this.formProperties).subscribe(() => {
        this.router.navigateByUrl(nextUrl);
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
