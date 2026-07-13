import { Component, computed, inject } from '@angular/core';
import { Router, Scroll } from '@angular/router';
import { Store } from '@ngrx/store';
import { isForm3Group, ReportStatus } from 'app/shared/models';
import { ReportCodes } from 'app/shared/utils/report-code.utils';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { LongDatePipe } from '../../shared/pipes/long-date.pipe';
import type { BaseForm3 } from 'app/shared/models/reports/base-form-3';
import { filter } from 'rxjs';
import { ReportService } from 'app/shared/services/report.service';

@Component({
  selector: 'app-report-summary',
  templateUrl: './submit-report-status.component.html',
  styleUrls: ['./submit-report-status.component.scss'],
  imports: [ButtonDirective, Ripple, LongDatePipe],
})
export class SubmitReportStatusComponent {
  ReportStatus = ReportStatus;
  private readonly store = inject(Store);
  public readonly router = inject(Router);
  private readonly reportService = inject(ReportService);
  readonly report = this.store.selectSignal(selectActiveReport);
  readonly reportCode = computed(() => this.report().report_code as ReportCodes);
  readonly isBaseF3 = computed(() => isForm3Group(this.report().report_type));
  readonly coverageDates = computed(() => (this.isBaseF3() ? (this.report() as BaseForm3).coverageDates : undefined));
  readonly fecStatus = computed(() => this.report().upload_submission?.fec_status);
  readonly fecMessage = computed(() => this.report().upload_submission?.fec_message);
  readonly reportStatus = computed(() => this.report().report_status!);
  readonly reportType = computed(() => this.report().report_code_label);

  constructor() {
    this.router.events.pipe(filter((event): event is Scroll => event instanceof Scroll)).subscribe(() => {
      this.reportService.setActiveReportById(this.report().id!);
    });
  }

  public backToReports() {
    this.router.navigateByUrl('/reports');
  }
}
