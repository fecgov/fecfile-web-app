import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, delay, of, takeUntil } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { Form3X } from 'app/shared/models/form-3x.model';
import { ApiService } from 'app/shared/services/api.service';
import { Form3XService } from 'app/shared/services/form-3x.service';
import { DestroyerComponent } from 'app/shared/components/app-destroyer.component';

@Component({
  selector: 'app-report-detailed-summary',
  templateUrl: './report-detailed-summary.component.html',
  styleUrls: ['../../styles.scss'],
})
export class ReportDetailedSummaryComponent extends DestroyerComponent implements OnInit {
  protected calculationFinished$ = new BehaviorSubject<boolean>(false);
  report: Form3X = new Form3X();

  constructor(
    public router: Router,
    private apiService: ApiService,
    private form3XService: Form3XService,
    private activatedRoute: ActivatedRoute
  ) {
    super();
  }

  ngOnInit(): void {
    this.calculationFinished$.pipe(takeUntil(this.destroy$)).subscribe();

    this.activatedRoute.data.pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.report = data['report'];
      if (!this.report.calculation_status) {
        this.apiService
          .post(`/web-services/summary/calculate-summary/`, { report_id: this.report.id })
          .subscribe(() => this.refreshSummary());
      } else if (this.report.calculation_status != 'SUCCEEDED') {
        of(true)
          .pipe(delay(1000), takeUntil(this.destroy$))
          .subscribe(() => this.refreshSummary());
      } else {
        this.calculationFinished$.next(true);
      }
    });
  }

  refreshSummary(): void {
    if (this.report.id) this.form3XService.get(this.report.id).subscribe((report) => (this.report = report as Form3X));
  }
}
