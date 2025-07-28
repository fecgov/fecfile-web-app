import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { DestroyerComponent } from 'app/shared/components/app-destroyer.component';
import { ReportStatus } from 'app/shared/models';
import { Form3XService } from 'app/shared/services/form-3x.service';
import { ReportCodes } from 'app/shared/utils/report-code.utils';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { LongDatePipe } from '../../shared/pipes/long-date.pipe';
import { derivedAsync } from 'ngxtension/derived-async';

@Component({
  selector: 'app-report-summary',
  templateUrl: './submit-report-status.component.html',
  styleUrls: ['./submit-report-status.component.scss'],
  imports: [ButtonDirective, Ripple, LongDatePipe],
})
export class SubmitReportStatusComponent extends DestroyerComponent {
  private readonly store = inject(Store);
  public readonly router = inject(Router);
  private readonly form3XService = inject(Form3XService);
  readonly activeReport = this.store.selectSignal(selectActiveReport);
  readonly reportCode = computed(() => this.activeReport().report_code as ReportCodes);
  readonly coverageDates = computed(() => this.activeReport().coverageDates);
  readonly fecStatus = computed(() => this.activeReport().upload_submission?.fec_status);
  readonly fecMessage = computed(() => this.activeReport().upload_submission?.fec_message);
  readonly reportStatus = computed(() => this.activeReport().report_status as ReportStatus);

  readonly isSuccess = computed(() => this.reportStatus() === ReportStatus.SUBMIT_SUCCESS);
  readonly isFailure = computed(() => this.reportStatus() === ReportStatus.SUBMIT_FAILURE);
  readonly isPending = computed(() => this.reportStatus() === ReportStatus.SUBMIT_PENDING);

  readonly reportType = derivedAsync(
    async () => {
      const reportCodeLabelMap = await this.form3XService.getReportCodeLabelMap();
      return reportCodeLabelMap[this.reportCode()];
    },
    { initialValue: '' },
  );

  public backToReports() {
    this.router.navigateByUrl('/reports');
  }
}
