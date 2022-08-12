import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectReportCodeLabelList } from 'app/store/label-lookup.selectors';
import { ReportCodeLabelList } from '../../../shared/utils/reportCodeLabels.utils';
import { f3xReportCodeDetailedLabels, LabelList } from '../../../shared/utils/label.utils';
import { F3xFormTypeLabels, F3xSummary } from '../../../shared/models/f3x-summary.model';
import { WebPrintService } from '../../../shared/services/web-print.service';
import { Report } from '../../../shared/interfaces/report.interface';
import { selectActiveReport } from '../../../store/active-report.selectors';

@Component({
  selector: 'app-report-summary',
  templateUrl: './f3x-web-print.component.html',
  styleUrls: ['../../styles.scss'],
})
export class ReportWebPrintComponent implements OnInit {
  reportCodeLabelList$: Observable<ReportCodeLabelList> = new Observable<ReportCodeLabelList>();
  report: F3xSummary = new F3xSummary();
  f3xFormTypeLabels: LabelList = F3xFormTypeLabels;
  f3xReportCodeDetailedLabels: LabelList = f3xReportCodeDetailedLabels;

  submitDate: Date | null = null;
  downloadURL = "";
  printError = "";
  pollingStatusMessage: "This may take a while..." |
    "Your report is still being processed. Please check back later to access your PDF" |
    "Checking Web-Print Status..." = "Checking Web-Print Status...";
  webPrintStage: "checking" | 
                  "not-submitted" | 
                  "success" | 
                  "failure" = "checking";

  constructor(
    private store: Store,
    private activatedRoute: ActivatedRoute,
    public router: Router,
    private webPrintService: WebPrintService,
  ) {}

  ngOnInit(): void {
    this.report = this.activatedRoute.snapshot.data["report"];
    this.reportCodeLabelList$ = this.store.select<ReportCodeLabelList>(selectReportCodeLabelList);
    this.store.select<Report | null>(selectActiveReport).subscribe((report)=>{
      if (report)
        this.updatePrintStatus(report);
    });
  }

  public updatePrintStatus(report: Report){
    if (!report.webprint_submission){
      this.webPrintStage = "not-submitted";
    } else {
      switch (report?.webprint_submission.fec_status){
        case "COMPLETED":
          this.webPrintStage = "success";
          this.downloadURL = report.webprint_submission.fec_image_url;
          this.submitDate = report.webprint_submission.created;
          break;
        case "FAILED":
          this.webPrintStage = "failure";
          this.printError = report.webprint_submission.fecfile_error;
          break;
        case "PROCESSING":
          this.webPrintStage = "checking";
          this.pollingStatusMessage = "Your report is still being processed. Please check back later to access your PDF"; 
          break;
      }
    }
  }

  public pollPrintStatus(){
    const pollingTime = 5000;
    this.pollingStatusMessage = "This may take a while...";
    this.webPrintStage = "checking";

    setTimeout(() => {
      this.refreshReportStatus();
    }, pollingTime);
  }

  public refreshReportStatus(){
    if (this.report.id)
      this.webPrintService.getStatus(this.report.id);
  }

  public submitPrintJob(){
    if (this.report.id){
      this.webPrintService.submitPrintJob(this.report.id);
      this.pollPrintStatus();
    }
  }

  public backToReports() {
    this.router.navigateByUrl('/reports');
  }

  public downloadPDF(){
    if (this.downloadURL.length > 0){
      window.open(this.downloadURL, '_blank');
    }
  }
}
