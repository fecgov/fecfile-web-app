import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { DestroyerComponent } from 'app/shared/components/app-destroyer.component';
import { CommitteeAccount } from 'app/shared/models/committee-account.model';
import { Form3X } from 'app/shared/models/form-3x.model';
import { Report } from 'app/shared/models/report.model';
import { ReportService } from 'app/shared/services/report.service';
import { WebPrintService } from 'app/shared/services/web-print.service';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { selectCommitteeAccount } from 'app/store/committee-account.selectors';
import { singleClickEnableAction } from 'app/store/single-click.actions';
import { firstValueFrom, takeUntil, take, timer, concatMap, tap, map } from 'rxjs';

@Component({
  selector: 'app-print-preview',
  templateUrl: './print-preview.component.html',
  styleUrls: ['../../styles.scss', './print-preview.component.scss'],
})
export class PrintPreviewComponent extends DestroyerComponent implements OnInit {
  report: Report = new Form3X() as unknown as Report;
  committeeAccount?: CommitteeAccount;
  submitDate: Date | undefined;
  downloadURL = '';
  printError = '';
  pollingTime = 2000;
  webPrintStage: 'checking' | 'not-submitted' | 'success' | 'failure' = 'not-submitted';
  getBackUrl?: (report?: Report) => string;
  getContinueUrl?: (report?: Report) => string;

  constructor(
    private store: Store,
    public router: Router,
    public route: ActivatedRoute,
    private webPrintService: WebPrintService,
    private reportService: ReportService,
  ) {
    super();
  }

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
        this.submitDate = report.webprint_submission.created;
        return;
      }
      // Otherwise the submission is still processing
      this.webPrintStage = 'checking';
    }
  }

  public pollPrintStatus(): void {
    /** Request the status of the report
     * tap into observable to update ui with status
     * delay polling again
     * if the status is not completed, poll again
     */

    this.reportService
      .get(this.report.id!)
      .pipe(
        tap((report) => {
          this.updatePrintStatus(report);
        }),
      )
      .pipe(concatMap((report) => timer(this.pollingTime).pipe(map(() => report))))
      .pipe(take(1))
      .pipe(takeUntil(this.destroy$))
      .subscribe((report) => {
        if (!report.webprint_submission?.fec_status || report.webprint_submission?.fec_status === 'PROCESSING') {
          this.pollPrintStatus();
        }
      });
  }

  public async submitPrintJob() {
    debugger;
    if (this.report.id) {
      /** Update the report with the committee information
       * this is a must because the .fec requires this information */
      await firstValueFrom(this.reportService.fecUpdate(this.report, this.committeeAccount));
      return this.webPrintService.submitPrintJob(this.report.id).then(
        () => {
          // Start polling for a completed status
          this.pollPrintStatus();
        },
        () => {
          // Handles any failure when submitting the print request
          this.webPrintStage = 'failure';
          this.printError = 'Failed to compile PDF';
        },
      );
    }
  }

  public downloadPDF() {
    if (this.downloadURL.length > 0) {
      window.open(this.downloadURL, '_blank');
    }
  }
}
