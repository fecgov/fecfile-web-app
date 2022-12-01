import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { LabelList } from '../../../shared/utils/label.utils';
import { F3xFormTypeLabels, F3xSummary } from '../../../shared/models/f3x-summary.model';
import { WebPrintService } from '../../../shared/services/web-print.service';
import { Report } from '../../../shared/interfaces/report.interface';
import { selectActiveReport } from '../../../store/active-report.selectors';

@Component({
  selector: 'app-report-web-print',
  templateUrl: './report-web-print.component.html',
  styleUrls: ['../../styles.scss'],
})
export class ReportWebPrintComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<boolean>();
  report: F3xSummary = new F3xSummary();
  f3xFormTypeLabels: LabelList = F3xFormTypeLabels;

  submitDate: Date | undefined;
  downloadURL = '';
  printError = '';
  pollingStatusMessage:
    | 'This may take a while...'
    | 'Your report is still being processed. Please check back later to access your PDF'
    | 'Checking Web-Print Status...' = 'Checking Web-Print Status...';
  webPrintStage: 'checking' | 'not-submitted' | 'success' | 'failure' = 'checking';

  constructor(private store: Store, public router: Router, private webPrintService: WebPrintService) {}

  ngOnInit(): void {
    this.store
      .select<Report | null>(selectActiveReport)
      .pipe(takeUntil(this.destroy$))
      .subscribe((report) => {
        if (report) {
          this.report = report as F3xSummary;
          this.updatePrintStatus(report);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  public updatePrintStatus(report: Report) {
    if (!report.webprint_submission) {
      this.webPrintStage = 'not-submitted';
    } else {
      switch (report?.webprint_submission.fec_status) {
        case 'COMPLETED':
          this.webPrintStage = 'success';
          this.downloadURL = report.webprint_submission.fec_image_url;
          this.submitDate = report.webprint_submission.created;
          break;
        case 'FAILED':
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
    const pollingTime = 5000;
    this.pollingStatusMessage = 'This may take a while...';
    this.webPrintStage = 'checking';

    setTimeout(() => {
      this.refreshReportStatus();
    }, pollingTime);
  }

  public refreshReportStatus() {
    if (this.report.id) this.webPrintService.getStatus(this.report.id);
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
