import { computed, Directive, effect, inject, input, linkedSignal, Signal, signal, viewChild } from '@angular/core';
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
import { ElectionCycle } from 'app/tools/election-cycle/election-cycle.model';

@Directive()
export abstract class BaseSummaryComponent {
  private readonly breakpointStore = inject(BreakpointStore);
  public readonly router = inject(Router);
  private readonly apiService = inject(ApiService);
  readonly reportService = inject(FORM_3_SERVICE);

  readonly sharedTemplate = viewChild.required(SharedSummaryTemplatesComponent);

  readonly reportLines = input.required<{
    report: BaseForm3;
    detailedLines?: {
      receipts: LineSummary[];
      disbursements: LineSummary[];
      third: LineSummary[];
    };
    lines?: LineSummary[];
    electionCycle?: ElectionCycle;
    nextElectionCycle?: ElectionCycle | null;
  }>();
  readonly report = linkedSignal(() => this.reportLines().report);
  readonly electionCycle = computed(() => this.reportLines().electionCycle);
  readonly type = computed(() => {
    if (this.reportService.isF3X) return 'F3X';
    if (isForm3S(this.report() as Form3)) return 'F3S';
    return 'F3';
  });
  readonly formText = this.reportService.isF3X ? 'f3x' : 'f3';

  readonly calculationFinished = computed(() => this.report().calculation_status === 'SUCCEEDED');

  readonly first = signal(0);
  readonly columns: Signal<ColumnDefinition<LineSummary>[]> = computed(() =>
    buildColumns(this.report(), this.type(), this.sharedTemplate().descriptionTpl(), this.breakpointStore, this.electionCycle()),
  );

  constructor() {
    effect(async () => {
      const report = this.report();
      if (!report.calculation_status) {
        await this.apiService.post(`/web-services/summary/calculate-summary/`, { report_id: report.id });
        this.refreshSummary();
      } else if (report.calculation_status != 'SUCCEEDED') {
        this.refreshSummary();
      }
    });
  }

  async refreshSummary() {
    this.report.set(await this.reportService.get(this.report().id!));
  }
}
