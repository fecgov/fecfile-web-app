import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { ReportCodes } from 'app/shared/utils/report-code.utils';
import { Form3XService } from 'app/shared/services/form-3x.service';
import { Card } from 'primeng/card';
import { NgOptimizedImage } from '@angular/common';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { LongDatePipe } from '../../shared/pipes/long-date.pipe';

@Component({
  selector: 'app-report-summary',
  templateUrl: './submit-report-status.component.html',
  styleUrls: ['./submit-report-status.component.scss'],
  imports: [Card, NgOptimizedImage, ButtonDirective, Ripple, LongDatePipe],
})
export class SubmitReportStatusComponent {
  private readonly store = inject(Store);
  public readonly router = inject(Router);
  readonly form3XService = inject(Form3XService);
  readonly report = this.store.selectSignal(selectActiveReport);
  readonly reportCode = computed(() => this.report().report_code as ReportCodes);
  readonly coverageDates = computed(() => this.report().coverageDates);
  readonly fecStatus = computed(() => this.report().upload_submission?.fec_status);
  readonly taskState = computed(() => this.report().upload_submission?.fecfile_task_state);
  readonly fecMessage = computed(() => this.report().upload_submission?.fec_message);

  public backToReports() {
    this.router.navigateByUrl('/reports');
  }
}
