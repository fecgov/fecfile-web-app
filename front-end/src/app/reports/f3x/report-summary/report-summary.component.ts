import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { F3xReport } from 'app/shared/models/report-types/f3x-report.model';
import { DestroyerComponent } from 'app/shared/components/app-destroyer.component';

@Component({
  selector: 'app-report-summary',
  templateUrl: './report-summary.component.html',
  styleUrls: ['../../styles.scss'],
})
export class ReportSummaryComponent extends DestroyerComponent implements OnInit {
  report: F3xReport = new F3xReport();

  constructor(private store: Store, public router: Router) {
    super();
  }

  ngOnInit(): void {
    this.store
      .select(selectActiveReport)
      .pipe(takeUntil(this.destroy$))
      .subscribe((report) => (this.report = report as F3xReport));
  }
}
