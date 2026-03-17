import { Component, computed, inject } from '@angular/core';
import { Router, Scroll } from '@angular/router';
import { Store } from '@ngrx/store';
import { ReportStatus, ReportTypes } from 'app/shared/models';
import { Form3XService } from 'app/shared/services/form-3x.service';
import { ReportCodes } from 'app/shared/utils/report-code.utils';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { LongDatePipe } from '../../shared/pipes/long-date.pipe';
import { BaseForm3 } from 'app/shared/models/reports/base-form-3';
import { filter } from 'rxjs';

@Component({
  selector: 'app-report-summary',
  templateUrl: './submit-report-status.component.html',
  styleUrls: ['./submit-report-status.component.scss'],
  imports: [ButtonDirective, Ripple, LongDatePipe],
})
export class SubmitReportStatusComponent {
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
  readonly reportType = computed(() => this.report().report_code_label);

  constructor() {
    this.router.events.pipe(filter((event): event is Scroll => event instanceof Scroll)).subscribe(() => {
      this.form3XService.setActiveReportById(this.report().id!);
    });
  }

  public backToReports() {
    this.router.navigateByUrl('/reports');
  }
}
