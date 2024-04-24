import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { DestroyerComponent } from 'app/shared/components/app-destroyer.component';
import { CommitteeAccount } from 'app/shared/models/committee-account.model';
import { Form3X } from 'app/shared/models/form-3x.model';
import { Report } from 'app/shared/models/report.model';
import { Form3XService } from 'app/shared/services/form-3x.service';
import { WebPrintService } from 'app/shared/services/web-print.service';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { selectCommitteeAccount } from 'app/store/committee-account.selectors';
import { singleClickEnableAction } from 'app/store/single-click.actions';
import { firstValueFrom, takeUntil } from 'rxjs';

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
    private webPrintService: WebPrintService,
    private form3XService: Form3XService,
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

  public async submitPrintJob() {
    if (this.report.id) {
      if (this.report instanceof Form3X) {
        const payload: Form3X = Form3X.fromJSON({
          ...this.report,
          qualified_committee: this.form3XService.isQualifiedCommittee(this.committeeAccount),
          committee_name: this.committeeAccount?.name,
          street_1: this.committeeAccount?.street_1,
          street_2: this.committeeAccount?.street_2,
          city: this.committeeAccount?.city,
          state: this.committeeAccount?.state,
          zip: this.committeeAccount?.zip,
        });
        await firstValueFrom(
          this.form3XService.update(payload, [
            'qualified_committee',
            'committee_name',
            'street_1',
            'street_2',
            'city',
            'state',
            'zip',
          ]),
        );
      }
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
