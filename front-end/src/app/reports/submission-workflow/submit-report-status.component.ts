import { Component, computed, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ReportStatus } from 'app/shared/models';
import { Form3XService } from 'app/shared/services/form-3x.service';
import { ReportCodes } from 'app/shared/utils/report-code.utils';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { LongDatePipe } from '../../shared/pipes/long-date.pipe';

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
  readonly activeReport = this.store.selectSignal(selectActiveReport);
  readonly reportCodeSignal = computed(() => this.activeReport().report_code as ReportCodes);
  readonly coverageDatesSignal = computed(() => this.activeReport().coverageDates);
  readonly fecStatusSignal = computed(() => this.activeReport().upload_submission?.fec_status);
  readonly fecMessageSignal = computed(() => this.activeReport().upload_submission?.fec_message);
  readonly reportStatusSignal = computed(() => this.activeReport().report_status as ReportStatus);

  reportCodeLabelMap?: { [key in ReportCodes]: string };

  ngOnInit(): void {
    this.form3XService.getReportCodeLabelMap().then((map) => (this.reportCodeLabelMap = map));
  }

  public backToReports() {
    this.router.navigateByUrl('/reports');
  }
}
