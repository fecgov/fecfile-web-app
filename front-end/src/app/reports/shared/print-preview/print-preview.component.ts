import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Form3X } from 'app/shared/models/form-3x.model';
import { WebPrintService } from 'app/shared/services/web-print.service';
import { Report } from 'app/shared/models/report.model';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { DestroyerComponent } from 'app/shared/components/app-destroyer.component';
import { singleClickEnableAction } from 'app/store/single-click.actions';

@Component({
  selector: 'app-print-preview',
  templateUrl: './print-preview.component.html',
  styleUrls: ['../../styles.scss'],
})
export class PrintPreviewComponent extends DestroyerComponent implements OnInit {
  report: Report = new Form3X() as unknown as Report;
  submitDate: Date | undefined;
  downloadURL = '';
  printError = '';
  pollingTime = 2000;
  pollingStatusMessage:
    | 'This may take a while...'
    | 'Your report is still being processed. Please check back later to access your PDF'
    | 'Checking Web-Print Status...' = 'Checking Web-Print Status...';
  webPrintStage: 'checking' | 'not-submitted' | 'success' | 'failure' = 'checking';
  getBackUrl?: (report?: Report) => string;
  getContinueUrl?: (report?: Report) => string;

  constructor(
    private store: Store,
    public router: Router,
    public route: ActivatedRoute,
    private webPrintService: WebPrintService
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
        }
      });

    this.route.data.subscribe(({ getBackUrl, getContinueUrl }) => {
      this.getBackUrl = getBackUrl;
      this.getContinueUrl = getContinueUrl;
    });
  }

  public updatePrintStatus(report: Report) {
    if (!report.webprint_submission) {
      this.webPrintStage = 'not-submitted';
    } else {
      switch (report?.webprint_submission.fec_status) {
        case 'COMPLETED':
          this.store.dispatch(singleClickEnableAction());
          this.webPrintStage = 'success';
          this.downloadURL = report.webprint_submission.fec_image_url;
          this.submitDate = report.webprint_submission.created;
          break;
        case 'FAILED':
          this.store.dispatch(singleClickEnableAction());
          this.webPrintStage = 'failure';
          this.printError = report.webprint_submission.fecfile_error;
          break;
        case 'PROCESSING':
          this.webPrintStage = 'checking';
          this.pollingStatusMessage =
            'Your report is still being processed. Please check back later to access your PDF';
          break;
      }
    }
  }

  public pollPrintStatus() {
    this.pollingStatusMessage = 'This may take a while...';
    this.webPrintStage = 'checking';

    setTimeout(() => {
      this.refreshReportStatus();
    }, this.pollingTime);
  }

  public refreshReportStatus() {
    if (this.report.id) {
      this.webPrintService.getStatus(this.report.id);
      if (
        !this.report.webprint_submission?.fec_status ||
        this.report.webprint_submission?.fec_status === 'PROCESSING'
      ) {
        setTimeout(() => {
          this.refreshReportStatus();
        }, this.pollingTime);
      }
    }
  }

  public submitPrintJob() {
    if (this.report.id) {
      this.webPrintService.submitPrintJob(this.report.id);
      this.pollPrintStatus();
    }
  }

  public downloadPDF() {
    if (this.downloadURL.length > 0) {
      window.open(this.downloadURL, '_blank');
    }
  }
}