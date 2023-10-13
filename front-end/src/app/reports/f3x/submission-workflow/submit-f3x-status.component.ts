import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { Form3X } from 'app/shared/models/form-3x.model';
import { LabelList } from '../../../shared/utils/label.utils';
import { F3xFormTypeLabels } from '../../../shared/models/form-3x.model';
import { DestroyerComponent } from 'app/shared/components/app-destroyer.component';

@Component({
  selector: 'app-report-summary',
  templateUrl: './submit-f3x-status.component.html',
})
export class ReportSubmissionStatusComponent extends DestroyerComponent implements OnInit {
  report: Form3X = new Form3X();
  f3xFormTypeLabels: LabelList = F3xFormTypeLabels;

  constructor(private store: Store, public router: Router) {
    super();
  }

  ngOnInit(): void {
    this.store
      .select(selectActiveReport)
      .pipe(takeUntil(this.destroy$))
      .subscribe((report) => (this.report = report as Form3X));
  }

  public backToReports() {
    this.router.navigateByUrl('/reports');
  }
}
