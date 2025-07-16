import { Component, computed, effect, inject, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormComponent } from 'app/shared/components/app-destroyer.component';
import { ErrorMessagesComponent } from 'app/shared/components/error-messages/error-messages.component';
import { SingleClickDirective } from 'app/shared/directives/single-click.directive';
import { MemoText } from 'app/shared/models/memo-text.model';
import { MemoTextService } from 'app/shared/services/memo-text.service';
import { SchemaUtils } from 'app/shared/utils/schema.utils';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';
import { schema as textSchema } from 'fecfile-validate/fecfile_validate_js/dist/Text';
import { MessageService } from 'primeng/api';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-report-level-memo',
  templateUrl: './report-level-memo.component.html',
  styleUrls: ['../../styles.scss'],
  imports: [ReactiveFormsModule, ErrorMessagesComponent, ButtonDirective, Ripple, SingleClickDirective, TextareaModule],
})
export class ReportLevelMemoComponent extends FormComponent implements OnInit {
  public readonly router = inject(Router);
  public readonly route = inject(ActivatedRoute);
  public readonly memoTextService = inject(MemoTextService);
  private readonly messageService = inject(MessageService);

  readonly recTypeFormProperty = 'rec_type';
  readonly text4kFormProperty = 'text4000';

  readonly formProperties: string[] = [this.recTypeFormProperty, this.text4kFormProperty];

  committeeAccountIdSignal = computed(() => this.committeeAccount().committee_id);
  routeDataSignal = toSignal(this.route.data);
  nextUrlSignal = computed(() => {
    const getNextUrl = this.routeDataSignal()?.['getNextUrl'];
    if (!getNextUrl) return '';
    return getNextUrl(this.activeReport());
  });

  assignedMemoText: MemoText = new MemoText();

  form: FormGroup = this.fb.group({}, { updateOn: 'blur' });

  constructor() {
    super();
    effect(() => {
      const report = this.activeReport();
      if (report.id) {
        this.memoTextService.getForReportId(report.id).then((memoTextList) => {
          if (memoTextList && memoTextList.length > 0) {
            this.assignedMemoText = memoTextList[0];
            this.form.get(this.text4kFormProperty)?.setValue(this.assignedMemoText.text4000);
          }
        });
      }
    });
  }

  ngOnInit(): void {
    this.form = this.fb.group(SchemaUtils.getFormGroupFields(this.formProperties), { updateOn: 'blur' });
    this.form.addControl(this.recTypeFormProperty, new SubscriptionFormControl());
    SchemaUtils.addJsonSchemaValidators(this.form, textSchema, false);
  }

  async save(): Promise<void> {
    this.formSubmitted = true;
    this.form.get(this.recTypeFormProperty)?.setValue('TEXT');

    const payload: MemoText = MemoText.fromJSON({
      ...this.assignedMemoText,
      ...SchemaUtils.getFormValues(this.form, textSchema, this.formProperties),
    });
    payload.report_id = this.activeReport().id;

    if (this.assignedMemoText.id) {
      await this.memoTextService.update(payload, this.formProperties);
      this.router.navigateByUrl(this.nextUrlSignal());
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Report Memo Updated',
        life: 3000,
      });
    } else {
      await this.memoTextService.create(payload, this.formProperties);
      this.router.navigateByUrl(this.nextUrlSignal());
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Report Memo Created',
        life: 3000,
      });
    }
  }
}
