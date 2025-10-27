import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, OnInit } from '@angular/core';

import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FormComponent } from 'app/shared/components/app-destroyer.component';
import { AutoResizeDirective } from 'app/shared/directives/auto-resize.directive';
import { SingleClickDirective } from 'app/shared/directives/single-click.directive';
import { Report } from 'app/shared/models';
import { MemoText } from 'app/shared/models/memo-text.model';
import { MemoTextService } from 'app/shared/services/memo-text.service';
import { SchemaUtils } from 'app/shared/utils/schema.utils';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';
import { schema as textSchema } from 'fecfile-validate/fecfile_validate_js/dist/Text';
import { injectRouteData } from 'ngxtension/inject-route-data';
import { MessageService } from 'primeng/api';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';

@Component({
  selector: 'app-report-level-memo',
  templateUrl: './report-level-memo.component.html',
  styleUrls: ['../../styles.scss', './report-level-memo.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, ButtonDirective, Ripple, SingleClickDirective, AutoResizeDirective],
})
export class ReportLevelMemoComponent extends FormComponent implements OnInit {
  readonly router = inject(Router);
  readonly memoTextService = inject(MemoTextService);
  private readonly messageService = inject(MessageService);

  readonly recTypeFormProperty = 'rec_type';
  readonly text4kFormProperty = 'text4000';
  readonly formProperties: string[] = [this.recTypeFormProperty, this.text4kFormProperty];

  readonly committeeAccountId = computed(() => this.committeeAccount().committee_id);
  readonly getNextUrl = injectRouteData<(report?: Report) => string | undefined | null>('getNextUrl');
  readonly nextUrl = computed(() => this.getNextUrl()?.(this.activeReport()) || '');

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
    this.updateColClass();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.updateColClass();
  }

  private updateColClass(): void {
    const w = window.innerWidth;
    if (w >= this.COL6_BREAKPOINT) {
      this.colClass = 'col-6';
    } else if (w >= this.COL8_BREAKPOINT) {
      this.colClass = 'col-8';
    } else {
      this.colClass = 'col-12';
    }
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
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Report Memo Updated',
        life: 3000,
      });
    } else {
      await this.memoTextService.create(payload, this.formProperties);
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Report Memo Created',
        life: 3000,
      });
    }

    this.router.navigateByUrl(this.nextUrl());
  }
}
