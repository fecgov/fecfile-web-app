import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { DestroyerComponent } from 'app/shared/components/app-destroyer.component';
import { Report } from 'app/shared/models/report.model';
import { ReportService } from 'app/shared/services/report.service';
import { WebPrintService } from 'app/shared/services/web-print.service';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { selectCommitteeAccount } from 'app/store/committee-account.selectors';
import { singleClickEnableAction } from 'app/store/single-click.actions';
import { Card } from 'primeng/card';
import { NgOptimizedImage } from '@angular/common';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { SingleClickDirective } from '../../../shared/directives/single-click.directive';
import { ServerSideEventService } from 'app/shared/services/server-side-event.service';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-print-preview',
  templateUrl: './print-preview.component.html',
  styleUrls: ['../../styles.scss', './print-preview.component.scss'],
  imports: [Card, NgOptimizedImage, ButtonDirective, Ripple, SingleClickDirective],
})
export class PrintPreviewComponent extends DestroyerComponent implements OnInit {
  private readonly store = inject(Store);
  public readonly router = inject(Router);
  public readonly route = inject(ActivatedRoute);
  private readonly webPrintService = inject(WebPrintService);
  private readonly reportService = inject(ReportService);
  private readonly sseService = inject(ServerSideEventService);
  readonly _report = this.store.selectSignal(selectActiveReport);
  private readonly committeeAccount = this.store.selectSignal(selectCommitteeAccount);

  readonly report = signal<Report>(this._report());

  submitDate: Date | undefined;
  downloadURL = '';
  printError = '';
  webPrintStage: 'checking' | 'not-submitted' | 'success' | 'failure' = 'not-submitted';
  getBackUrl?: (report?: Report) => string;
  getContinueUrl?: (report?: Report) => string;

  constructor() {
    super();
    effect(() => {
      const report = this.report();
      this.updatePrintStatus(report);
    });
  }

  ngOnInit(): void {
    const report = this.report();
    this.updatePrintStatus(report);
    if (this.webPrintStage === 'checking' && report.webprint_submission?.id) {
      this.listenForPrintStatus(report.webprint_submission.id);
    }

    this.route.data.subscribe(({ getBackUrl, getContinueUrl }) => {
      this.getBackUrl = getBackUrl;
      this.getContinueUrl = getContinueUrl;
    });
  }

  async updateReport() {
    const report = await this.reportService.get(this.report().id!);
    this.report.set(report);
  }

  public updatePrintStatus(report: Report) {
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
        this.submitDate = report.webprint_submission.created;
        return;
      }
      // Otherwise the submission is still processing
      this.webPrintStage = 'checking';
    }
  }

  public listenForPrintStatus(submissionId: string | number): void {
    this.sseService
      .webPrintNotification(submissionId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (status) => {
          console.log(`WebPrint job finished with status: ${status}`);
        },
        error: (err) => {
          console.log(`WebPrint job failed with error: ${err}`);
        },
        complete: () => this.updateReport(),
      });
  }

  public async submitPrintJob() {
    const report = this.report();
    const committeeAccount = this.committeeAccount();
    if (report.id && committeeAccount) {
      await this.reportService.fecUpdate(report, committeeAccount);

      try {
        const response = await this.webPrintService.submitPrintJob(report.id);
        this.webPrintStage = 'checking';
        this.listenForPrintStatus(response.submission_id);
      } catch (err) {
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
