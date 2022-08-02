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
  webPrintStage: 0 | 1 | 2 = 0;

  constructor(
    private store: Store,
    private activatedRoute: ActivatedRoute,
    public router: Router,
    private webPrintService: WebPrintService,
  ) {}

  ngOnInit(): void {
    this.reportCodeLabelList$ = this.store.select<ReportCodeLabelList>(selectReportCodeLabelList);
    this.report = this.activatedRoute.snapshot.data['report'];
  }

  public mockedAdvancePrint(){
    if (this.webPrintStage === 0){
      this.webPrintStage = 1;
      setTimeout(() => {
        this.webPrintStage = 2;
      }, 5000);
    }
  }

  public backToReports() {
    this.router.navigateByUrl('/reports');
  }

  public getPrintStatus(){
    this.webPrintService.getDetails(this.report.reportId).subscribe((response: WebPrint)=>{
      const status = response.status;
      switch (status) {
        case undefined:
          this.webPrintStage = 0; break;
        case "in-progress":
          this.webPrintStage = 1; break;
        case "success":
          this.webPrintStage = 2; break;
      }
    });
  }
}
