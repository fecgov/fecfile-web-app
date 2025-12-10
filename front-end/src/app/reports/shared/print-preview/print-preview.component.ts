import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { DestroyerComponent } from 'app/shared/components/destroyer.component';
import { CommitteeAccount } from 'app/shared/models/committee-account.model';
import { Form3X } from 'app/shared/models/reports/form-3x.model';
import { Report } from 'app/shared/models/reports/report.model';
import { ReportService } from 'app/shared/services/report.service';
import { WebPrintService } from 'app/shared/services/web-print.service';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { selectCommitteeAccount } from 'app/store/committee-account.selectors';
import { singleClickEnableAction } from 'app/store/single-click.actions';
import { takeUntil } from 'rxjs';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { SingleClickDirective } from '../../../shared/directives/single-click.directive';
import { LayoutService } from 'app/layout/layout.service';

@Component({
  selector: 'app-print-preview',
  templateUrl: './print-preview.component.html',
  styleUrls: ['../../styles.scss', './print-preview.component.scss'],
  imports: [ButtonDirective, Ripple, SingleClickDirective],
})
export class PrintPreviewComponent extends DestroyerComponent implements OnInit {
  private readonly store = inject(Store);
  public readonly router = inject(Router);
  public readonly route = inject(ActivatedRoute);
  private readonly webPrintService = inject(WebPrintService);
  private readonly reportService = inject(ReportService);
  readonly layoutService = inject(LayoutService);
  report: Report = new Form3X() as unknown as Report;
  committeeAccount?: CommitteeAccount;
  readonly submitDate = signal<Date | undefined>(undefined);
  readonly formattedDate = computed(() => {
    const date = this.submitDate();
    if (!date) return '';
    let dateString = new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      timeZoneName: 'long',
    }).format(date);
    dateString = dateString.replace(/(\d{4})[\s,]+(?:at\s+)?(\d{1,2}:)/, '$1, at $2');
    dateString = dateString.replace(' Standard Time', ' Time');
    dateString = dateString.replace(' Daylight Time', ' Time');
    const parts = dateString.split(/( AM | PM )/);
    if (parts.length === 3) {
      return `${parts[0]}${parts[1]}(${parts[2].trim()})`;
    }
    return dateString;
  });
  downloadURL = '';
  printError = '';
  pollingTime = 2000;
  webPrintStage: 'checking' | 'not-submitted' | 'success' | 'failure' = 'not-submitted';
  getBackUrl?: (report?: Report) => string;
  getContinueUrl?: (report?: Report) => string;

  ngOnInit(): void {
    this.store
      .select<Report | null>(selectActiveReport)
      .pipe(takeUntil(this.destroy$))
      .subscribe((report) => {
        if (report) {
          this.report = report;
          this.updatePrintStatus(report);
          if (this.webPrintStage === 'checking') {
            this.pollPrintStatus();
          }
        }
      });

    this.store
      .select(selectCommitteeAccount)
      .pipe(takeUntil(this.destroy$))
      .subscribe((committeeAccount) => {
        this.committeeAccount = committeeAccount;
      });

    this.route.data.subscribe(({ getBackUrl, getContinueUrl }) => {
      this.getBackUrl = getBackUrl;
      this.getContinueUrl = getContinueUrl;
    });
  }

  public updatePrintStatus(report: Report) {
    this.report = report;
    if (!report.webprint_submission) {
      // If there is no submission object, the preview has not been submitted
      this.webPrintStage = 'not-submitted';
    } else {
      // Determine the status of the submission
      const fecfile_task_state = report.webprint_submission.fecfile_task_state;
      const fec_status = report.webprint_submission.fec_status;
      if (fecfile_task_state === 'FAILED' || fec_status === 'FAILED') {
        /** If the submission failed, display the error message
         * 'FAILED' in fec_status means that the EFO service failed to create the print preview
         * 'FAILED' in fecfile_task_state means the task failed (which could be because of
         * a failure in the EFO service or a failure on our side while creating the .fec,
         * for example)
         * */
        this.store.dispatch(singleClickEnableAction());
        this.webPrintStage = 'failure';
        this.printError = report.webprint_submission.fec_message || report.webprint_submission.fecfile_error;
        return;
      }
      if (fec_status === 'COMPLETED' && fecfile_task_state === 'SUCCEEDED') {
        /** If the submission is complete, display the download button
         * we want to see a completed status from EFO and a succeeded
         * task state from our celery task.
         */
        this.store.dispatch(singleClickEnableAction());
        this.webPrintStage = 'success';
        this.downloadURL = report.webprint_submission.fec_image_url;
        this.submitDate.set(report.webprint_submission.created);
        return;
      }
      // Otherwise the submission is still processing
      this.webPrintStage = 'checking';
    }
  }

  public async pollPrintStatus(): Promise<void> {
    /** Request the status of the report
     * tap into observable to update ui with status
     * delay polling again
     * if the status is not completed, poll again
     */
    try {
      const report = await this.reportService.get(this.report.id!);
      this.updatePrintStatus(report);
      await new Promise((resolve) => setTimeout(resolve, this.pollingTime));
      if (!report.webprint_submission?.fec_status || report.webprint_submission?.fec_status === 'PROCESSING') {
        this.pollPrintStatus();
      }
    } catch (error) {
      console.error('Error fetching report:', error);
    }
  }

  public async submitPrintJob() {
    if (this.report.id) {
      /** Update the report with the committee information
       * this is a must because the .fec requires this information */
      await this.reportService.fecUpdate(this.report, this.committeeAccount);
      try {
        await this.webPrintService.submitPrintJob(this.report.id);
        // Start polling for a completed status
        return this.pollPrintStatus();
      } catch {
        // Handles any failure when submitting the print request
        this.webPrintStage = 'failure';
        this.printError = 'Failed to compile PDF';
      }
    }
  }

  public downloadPDF() {
    if (this.downloadURL.length > 0) {
      window.open(this.downloadURL, '_blank');
    }
  }
}
