import { Component, computed } from '@angular/core';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { TableComponent } from 'app/shared/components/table/table.component';
import { BaseSummaryComponent } from '../base-summary.component';
import { SharedSummaryTemplatesComponent } from '../shared-summary-templates.component';
import { BreakpointStore } from 'app/store/breakpoint.store';
import { getLineSummaries } from './lines';

@Component({
  selector: 'app-report-summary',
  templateUrl: './report-summary.component.html',
  styleUrls: ['../summaries.scss'],
  imports: [ButtonDirective, Ripple, TableModule, TableComponent, SharedSummaryTemplatesComponent],
  providers: [BreakpointStore],
})
export class ReportSummaryComponent extends BaseSummaryComponent {
  readonly lines = computed(() => getLineSummaries(this.report()));
}
