import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { DestroyerComponent } from 'app/shared/components/app-destroyer.component';
import { Form3X } from 'app/shared/models/form-3x.model';
import { MemoText } from 'app/shared/models/memo-text.model';
import { MemoTextService } from 'app/shared/services/memo-text.service';
import { SchemaUtils } from 'app/shared/utils/schema.utils';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { selectCommitteeAccount } from 'app/store/committee-account.selectors';
import { schema as textSchema } from 'fecfile-validate/fecfile_validate_js/dist/Text';
import { MessageService } from 'primeng/api';
import { takeUntil } from 'rxjs';
import { Report } from 'app/shared/models/report.model';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';
import { ErrorMessagesComponent } from '../../../shared/components/error-messages/error-messages.component';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { SingleClickDirective } from '../../../shared/directives/single-click.directive';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-report-level-memo',
  templateUrl: './report-level-memo.component.html',
  styleUrls: ['../../styles.scss'],
  imports: [ReactiveFormsModule, ErrorMessagesComponent, ButtonDirective, Ripple, SingleClickDirective, TextareaModule],
})
export class ReportLevelMemoComponent extends DestroyerComponent implements OnInit {
  private readonly store = inject(Store);
  protected readonly fb = inject(FormBuilder);
  public readonly router = inject(Router);
  public readonly route = inject(ActivatedRoute);
  public readonly memoTextService = inject(MemoTextService);
  private readonly messageService = inject(MessageService);

  readonly recTypeFormProperty = 'rec_type';
  readonly text4kFormProperty = 'text4000';

  readonly formProperties: string[] = [this.recTypeFormProperty, this.text4kFormProperty];

  report = new Form3X() as Report;
  committeeAccountId: string | undefined;
  nextUrl = '';

  assignedMemoText: MemoText = new MemoText();

  formSubmitted = false;
  form: FormGroup = this.fb.group({}, { updateOn: 'blur' });

  ngOnInit(): void {
    this.form = this.fb.group(SchemaUtils.getFormGroupFields(this.formProperties), { updateOn: 'blur' });
    this.form.addControl(this.recTypeFormProperty, new SubscriptionFormControl());
    this.store
      .select(selectCommitteeAccount)
      .pipe(takeUntil(this.destroy$))
      .subscribe((committeeAccount) => (this.committeeAccountId = committeeAccount?.committee_id));

    this.store
      .select(selectActiveReport)
      .pipe(takeUntil(this.destroy$))
      .subscribe((report) => {
        this.report = report;
        if (this.report?.id) {
          this.memoTextService.getForReportId(this.report.id).then((memoTextList) => {
            if (memoTextList && memoTextList.length > 0) {
              this.assignedMemoText = memoTextList[0];
              this.form.get(this.text4kFormProperty)?.setValue(this.assignedMemoText.text4000);
            }
          });
        }
        this.route.data.subscribe(({ getNextUrl }) => {
          this.nextUrl = getNextUrl(this.report);
        });
      });

    SchemaUtils.addJsonSchemaValidators(this.form, textSchema, false);
  }

  async save(): Promise<void> {
    this.formSubmitted = true;
    this.form.get(this.recTypeFormProperty)?.setValue('TEXT');

    const payload: MemoText = MemoText.fromJSON({
      ...this.assignedMemoText,
      ...SchemaUtils.getFormValues(this.form, textSchema, this.formProperties),
    });
    payload.report_id = this.report.id;

    if (this.assignedMemoText.id) {
      await this.memoTextService.update(payload, this.formProperties);
      this.router.navigateByUrl(this.nextUrl);
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Report Memo Updated',
        life: 3000,
      });
    } else {
      await this.memoTextService.create(payload, this.formProperties);
      this.router.navigateByUrl(this.nextUrl);
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Report Memo Created',
        life: 3000,
      });
    }
  }
}
