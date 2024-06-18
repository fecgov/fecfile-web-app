import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { DestroyerComponent } from 'app/shared/components/app-destroyer.component';
import { Report } from 'app/shared/models/report.model';
import { F3xReportCodes } from 'app/shared/utils/report-code.utils';
import { Form3XService } from 'app/shared/services/form-3x.service';

@Component({
  selector: 'app-report-summary',
  templateUrl: './submit-report-status.component.html',
  styleUrls: ['./submit-report-status.component.scss'],
})
export class SubmitReportStatusComponent extends DestroyerComponent implements OnInit {
  report?: Report;
  reportCode?: F3xReportCodes;
  coverageDates?: { [key: string]: Date | undefined };
  reportCodeLabelMap?: { [key in F3xReportCodes]: string };

  constructor(
    private store: Store,
    public router: Router,
    private form3XService: Form3XService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.form3XService.getReportCodeLabelMap().then((map) => (this.reportCodeLabelMap = map));
    this.store
      .select(selectActiveReport)
      .pipe(takeUntil(this.destroy$))
      .subscribe((report) => {
        this.report = report;
        this.reportCode = report.report_code as F3xReportCodes;
        this.coverageDates = report.coverageDates;
      });
  }

  public backToReports() {
    this.router.navigateByUrl('/reports');
  }
}
