import { Component, computed, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ReportStatus, ReportTypes } from 'app/shared/models';
import { Form3XService } from 'app/shared/services/form-3x.service';
import { ReportCodes } from 'app/shared/utils/report-code.utils';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { LongDatePipe } from '../../shared/pipes/long-date.pipe';
import { BaseForm3 } from 'app/shared/models/reports/base-form-3';

@Component({
  selector: 'app-report-summary',
  templateUrl: './submit-report-status.component.html',
  styleUrls: ['./submit-report-status.component.scss'],
  imports: [ButtonDirective, Ripple, LongDatePipe],
})
export class SubmitReportStatusComponent implements OnInit {
  reportStatusEnum = ReportStatus;
  private readonly store = inject(Store);
  public readonly router = inject(Router);
  private readonly form3XService = inject(Form3XService);
  readonly report = this.store.selectSignal(selectActiveReport);
  readonly reportCode = computed(() => this.report().report_code as ReportCodes);
  readonly isBaseF3 = computed(() => [ReportTypes.F3, ReportTypes.F3X].includes(this.report().report_type));
  readonly coverageDates = computed(() => (this.isBaseF3() ? (this.report() as BaseForm3).coverageDates : undefined));
  readonly fecStatus = computed(() => this.report().upload_submission?.fec_status);
  readonly fecMessage = computed(() => this.report().upload_submission?.fec_message);
  readonly reportStatus = computed(() => this.report().report_status as ReportStatus);

  reportCodeLabelMap?: { [key in ReportCodes]: string };

  ngOnInit(): void {
    this.form3XService.getReportCodeLabelMap().then((map) => (this.reportCodeLabelMap = map));
  }

  public backToReports() {
    this.router.navigateByUrl('/reports');
  }
}
