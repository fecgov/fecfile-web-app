import { Component, inject, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { DestroyerComponent } from 'app/shared/components/app-destroyer.component';
import { Report } from 'app/shared/models/report.model';
import { ReportCodes } from 'app/shared/utils/report-code.utils';
import { Form3XService } from 'app/shared/services/form-3x.service';
import { Card } from 'primeng/card';
import { NgOptimizedImage } from '@angular/common';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { LongDatePipe } from '../../shared/pipes/long-date.pipe';

@Component({
  selector: 'app-report-summary',
  templateUrl: './submit-report-status.component.html',
  styleUrls: ['./submit-report-status.component.scss'],
  imports: [Card, NgOptimizedImage, ButtonDirective, Ripple, LongDatePipe],
})
export class SubmitReportStatusComponent extends DestroyerComponent implements OnInit {
  private readonly store = inject(Store);
  public readonly router = inject(Router);
  private readonly form3XService = inject(Form3XService);
  report?: Report;
  reportCode?: ReportCodes;
  coverageDates?: { [key: string]: Date | undefined };
  reportCodeLabelMap?: { [key in ReportCodes]: string };

  ngOnInit(): void {
    this.form3XService.getReportCodeLabelMap().then((map) => (this.reportCodeLabelMap = map));
    this.store
      .select(selectActiveReport)
      .pipe(takeUntil(this.destroy$))
      .subscribe((report) => {
        this.report = report;
        this.reportCode = report.report_code as ReportCodes;
        this.coverageDates = report.coverageDates;
      });
  }

  public backToReports() {
    this.router.navigateByUrl('/reports');
  }
}
