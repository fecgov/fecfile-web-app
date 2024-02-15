import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { DestroyerComponent } from 'app/shared/components/app-destroyer.component';
import { Report } from 'app/shared/models/report.model';
import { F3xReportCodes } from 'app/shared/utils/report-code.utils';

@Component({
  selector: 'app-report-summary',
  templateUrl: './submit-report-status.component.html',
})
export class SubmitReportStatusComponent extends DestroyerComponent implements OnInit {
  report?: Report;
  reportCode?: F3xReportCodes;
  coverageDates?: { [key: string]: Date | undefined };

  constructor(
    private store: Store,
    public router: Router,
  ) {
    super();
  }

  ngOnInit(): void {
    this.store
      .select(selectActiveReport)
      .pipe(takeUntil(this.destroy$))
      .subscribe((report) => {
        this.report = report;
        this.reportCode = report.reportCode;
        this.coverageDates = report.coverageDates;
      });
  }

  public backToReports() {
    this.router.navigateByUrl('/reports');
  }
}
