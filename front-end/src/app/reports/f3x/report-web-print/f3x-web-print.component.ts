import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectReportCodeLabelList } from 'app/store/label-lookup.selectors';
import { F3xSummary } from 'app/shared/models/f3x-summary.model';
import { ReportCodeLabelList } from '../../../shared/utils/reportCodeLabels.utils';
import { f3xReportCodeDetailedLabels, LabelList } from '../../../shared/utils/label.utils';
import { F3xFormTypeLabels } from '../../../shared/models/f3x-summary.model';
import { WebPrintService } from '../../../shared/services/web-print.service';
import { WebPrint } from '../../../shared/models/web-print.model';

@Component({
  selector: 'app-report-summary',
  templateUrl: './f3x-web-print.component.html',
  styleUrls: ['../../styles.scss'],
})
export class ReportWebPrintComponent implements OnInit {
  report: F3xSummary = new F3xSummary();
  reportCodeLabelList$: Observable<ReportCodeLabelList> = new Observable<ReportCodeLabelList>();
  f3xFormTypeLabels: LabelList = F3xFormTypeLabels;
  f3xReportCodeDetailedLabels: LabelList = f3xReportCodeDetailedLabels;

  submitDate: Date | undefined;
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
    this.reportCodeLabelList$ = this.store.select<ReportCodeLabelList>(selectReportCodeLabelList);
    this.report = this.activatedRoute.snapshot.data['report'];
    this.pollPrintStatus(0, true);
  }

  public pollPrintStatus(pollingCount = 0, firstLoad = false){
    let pollingTime = 1000;
    if (firstLoad)
      this.pollingStatusMessage = "Checking Web-Print Status...";
    else
      this.pollingStatusMessage = "This may take a while...";

    if (pollingCount > 4){
      pollingTime = 3000;
      this.pollingStatusMessage = "Your report is still being processed. Please check back later to access your PDF";
    }

    this.webPrintStage = "checking";
    setTimeout(() => {
      this.getPrintStatus(pollingCount, firstLoad);
    }, pollingTime);
  }

  public backToReports() {
    this.router.navigateByUrl('/reports');
  }

  public downloadPDF(newTab = false){
    if (this.downloadURL.length > 0){
      if (newTab)
        window.open(this.downloadURL, '_blank');
      else {
        window.open(this.downloadURL);
      }
    }
  }

  public submitPrintJob(){
    if (this.report.id){
      this.webPrintService.submitPrintJob(this.report.id).subscribe((response: WebPrint)=>{
        this.processResponse(response);
      })
    }
  }

  public getPrintStatus(pollingCount = 0, firstLoad = false){
    if (this.report.id){
      this.webPrintService.getStatus(this.report.id).subscribe((response: WebPrint)=>{
        this.processResponse(response, pollingCount, firstLoad);
      });
    }
  }

  private processResponse(response: WebPrint, pollingCount = 0, firstLoad = false){
    const status = response.status;
    switch (status) {
      case null:
        this.webPrintStage = "not-submitted";
        break;
      case "success":
        this.webPrintStage = "success";
        if (response.result)
          this.downloadURL = response.result;
          this.submitDate = response.submitted;
        break;
      case "in-progress":
        this.pollPrintStatus(pollingCount+1, firstLoad);
        break;
      case "failure":
        this.webPrintStage = "failure";
        if (response.result)
          this.printError = response.result;
        break;
    }
  }
}
