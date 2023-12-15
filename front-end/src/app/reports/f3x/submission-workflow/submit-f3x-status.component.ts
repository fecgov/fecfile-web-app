import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectActiveForm3X } from 'app/store/active-report.selectors';
import { Form3X } from 'app/shared/models/form-3x.model';
import { DestroyerComponent } from 'app/shared/components/app-destroyer.component';

@Component({
  selector: 'app-report-summary',
  templateUrl: './submit-f3x-status.component.html',
})
export class ReportSubmissionStatusComponent extends DestroyerComponent implements OnInit {
  report: Form3X = new Form3X();

  constructor(private store: Store, public router: Router) {
    super();
  }

  ngOnInit(): void {
    this.store
      .select(selectActiveForm3X)
      .pipe(takeUntil(this.destroy$))
      .subscribe((report) => (this.report = report));
  }

  public backToReports() {
    this.router.navigateByUrl('/reports');
  }
}
