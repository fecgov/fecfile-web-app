import { Component, computed } from '@angular/core';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { TableComponent } from 'app/shared/components/table/table.component';
import { TableModule } from 'primeng/table';
import { BaseSummaryComponent } from '../base-summary.component';
import { SharedSummaryTemplatesComponent } from '../shared-summary-templates.component';
import { BreakpointStore } from 'app/store/breakpoint.store';
import { getF3Lines } from 'app/reports/f3-shared/summaries/report-detailed-summary/f3-detailed-line-summaries';
import { getF3XLines } from 'app/reports/f3-shared/summaries/report-detailed-summary/f3x-detailed-line-summaries';
import { Form3X } from 'app/shared/models/reports/form-3x.model';
import { Form3 } from 'app/shared/models/reports/form-3.model';

@Component({
  selector: 'app-report-detailed-summary',
  templateUrl: './report-detailed-summary.component.html',
  styleUrls: ['./report-detailed-summary.component.scss', '../summaries.scss'],
  imports: [ButtonDirective, Ripple, TableModule, TableComponent, SharedSummaryTemplatesComponent],
  providers: [BreakpointStore],
})
export class ReportDetailedSummaryComponent extends BaseSummaryComponent {
  readonly lines = computed(() =>
    this.reportService.isF3X ? getF3XLines(this.report() as Form3X) : getF3Lines(this.report() as Form3),
  );

  readonly thirdTitle = computed(() =>
    this.reportService.isF3X ? 'Net contributions/operating expenditures' : 'Cash summary',
  );
}
