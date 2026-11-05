import { computed, Directive, inject, model, OnInit, Signal, signal, untracked, viewChild } from '@angular/core';
import { BaseForm3 } from 'app/shared/models/reports/base-form-3';
import { Router } from '@angular/router';
import { ApiService } from 'app/shared/services/api.service';
import { SharedSummaryTemplatesComponent } from './shared-summary-templates.component';
import { FORM_3_SERVICE } from 'app/shared/services/base-form-3.service';
import { Form3, isForm3S } from 'app/shared/models/reports/form-3.model';
import { ColumnDefinition } from 'app/shared/components/table/table.component';
import { buildColumns } from './table.config';
import { BreakpointStore } from 'app/store/breakpoint.store';
import { LineSummary } from 'app/shared/models/reports/lines.model';
import { switchMap, takeUntil, takeWhile, timer } from 'rxjs';
import { injectDestroy } from 'ngxtension/inject-destroy';

@Directive()
export abstract class BaseSummaryComponent implements OnInit {
  private readonly destroy$ = injectDestroy();
  private readonly breakpointStore = inject(BreakpointStore);
  public readonly router = inject(Router);
  private readonly apiService = inject(ApiService);
  readonly reportService = inject(FORM_3_SERVICE);

  readonly sharedTemplate = viewChild.required(SharedSummaryTemplatesComponent);

  readonly report = model.required<BaseForm3>();
  readonly electionCycle = computed(() =>
    this.reportService.isF3X ? undefined : (this.report() as Form3).electionCycle,
  );
  readonly nextElectionCycle = computed(() =>
    this.reportService.isF3X ? undefined : (this.report() as Form3).nextElectionCycle,
  );
  readonly type = computed(() => {
    if (this.reportService.isF3X) return 'F3X';
    if (isForm3S(this.report() as Form3)) return 'F3S';
    return 'F3';
  });
  readonly formText = this.reportService.isF3X ? 'f3x' : 'f3';

  readonly calculationFinished = computed(() => this.report().calculation_status === 'SUCCEEDED');

  readonly first = signal(0);
  readonly columns: Signal<ColumnDefinition<LineSummary>[]> = computed(() =>
    buildColumns(this.type(), this.sharedTemplate().descriptionTpl(), this.breakpointStore, this.electionCycle()),
  );

  ngOnInit() {
    const report = this.report();
    if (report.calculation_status === 'SUCCEEDED') return;

    timer(0, 500)
      .pipe(
        switchMap(async () => {
          if (!report.calculation_status) {
            await this.apiService.post('/web-services/summary/calculate-summary/', {
              report_id: report.id,
            });
          }

          return this.reportService.get(report.id!);
        }),
        takeWhile((updatedReport) => updatedReport.calculation_status !== 'SUCCEEDED', true),
        takeUntil(this.destroy$),
      )
      .subscribe((updatedReport) => {
        if (!this.reportService.isF3X) {
          untracked(() => {
            (updatedReport as Form3).electionCycle = this.electionCycle();
            (updatedReport as Form3).nextElectionCycle = this.nextElectionCycle();
          });
        }
        this.report.set(updatedReport);
      });
  }
}
