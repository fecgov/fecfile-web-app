import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { DestroyerComponent } from 'app/shared/components/app-destroyer.component';
import { Report } from 'app/shared/models/report.model';

@Component({
  selector: 'app-report-summary',
  templateUrl: './submit-report-status.component.html',
})
export class ReportSubmissionStatusComponent extends DestroyerComponent implements OnInit {
  report?: Report;

  constructor(private store: Store, public router: Router) {
    super();
  }

  ngOnInit(): void {
    this.store
      .select(selectActiveReport)
      .pipe(takeUntil(this.destroy$))
      .subscribe((report) => {
        this.report = report as Report;
      });
  }

  public backToReports() {
    this.router.navigateByUrl('/reports');
  }
}
