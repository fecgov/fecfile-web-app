import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { LabelList } from '../../../shared/utils/label.utils';
import { F3xFormTypeLabels, Form3X } from '../../../shared/models/form-3x.model';
import { WebPrintService } from '../../../shared/services/web-print.service';
import { Report } from '../../../shared/models/report.model';
import { selectActiveReport } from '../../../store/active-report.selectors';
import { DestroyerComponent } from 'app/shared/components/app-destroyer.component';
import { spinnerOffAction } from "../../../store/spinner.actions";

@Component({
  selector: 'app-report-web-print',
  templateUrl: './report-web-print.component.html',
  styleUrls: ['../../styles.scss'],
})
export class ReportWebPrintComponent extends DestroyerComponent implements OnInit {
  report: Form3X = new Form3X();
  f3xFormTypeLabels: LabelList = F3xFormTypeLabels;
  submitDate: Date | undefined;
  downloadURL = '';
  printError = '';
  pollingStatusMessage:
    | 'This may take a while...'
    | 'Your report is still being processed. Please check back later to access your PDF'
    | 'Checking Web-Print Status...' = 'Checking Web-Print Status...';
  webPrintStage: 'checking' | 'not-submitted' | 'success' | 'failure' = 'checking';

  constructor(private store: Store, public router: Router, private webPrintService: WebPrintService) {
    super();
  }

  ngOnInit(): void {
    this.store
      .select<Report | null>(selectActiveReport)
      .pipe(takeUntil(this.destroy$))
      .subscribe((report) => {
        if (report) {
          this.report = report as Form3X;
          this.updatePrintStatus(report);
        }
      });
  }

  public updatePrintStatus(report: Report) {
    if (!report.webprint_submission) {
      this.webPrintStage = 'not-submitted';
    } else {
      switch (report?.webprint_submission.fec_status) {
        case 'COMPLETED':
          this.store.dispatch(spinnerOffAction());
          this.webPrintStage = 'success';
          this.downloadURL = report.webprint_submission.fec_image_url;
          this.submitDate = report.webprint_submission.created;
          break;
        case 'FAILED':
          this.store.dispatch(spinnerOffAction());
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
    const pollingTime = 1000;
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
