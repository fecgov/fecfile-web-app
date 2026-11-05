import { Component, computed } from '@angular/core';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { TableComponent } from 'app/shared/components/table/table.component';
import { TableModule } from 'primeng/table';
import { BaseSummaryComponent } from '../base-summary.component';
import { SharedSummaryTemplatesComponent } from '../shared-summary-templates.component';
import { BreakpointStore } from 'app/store/breakpoint.store';

@Component({
  selector: 'app-report-detailed-summary',
  templateUrl: './report-detailed-summary.component.html',
  styleUrls: ['./report-detailed-summary.component.scss', '../summaries.scss'],
  imports: [ButtonDirective, Ripple, TableModule, TableComponent, SharedSummaryTemplatesComponent],
  providers: [BreakpointStore],
})
export class ReportDetailedSummaryComponent extends BaseSummaryComponent {
  readonly receiptLines = computed(() => this.reportLines().detailedLines!.receipts);
  readonly disbursementLines = computed(() => this.reportLines().detailedLines!.disbursements);
  readonly thirdLines = computed(() => this.reportLines().detailedLines!.third);

  readonly thirdTitle = computed(() =>
    this.reportService.isF3X ? 'Net contributions/operating expenditures' : 'Cash summary',
  );
}
