import { Component, computed } from '@angular/core';
import { Form3X } from 'app/shared/models/reports/form-3x.model';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { TableComponent } from 'app/shared/components/table/table.component';
import { TableModule } from 'primeng/table';
import {
  receiptLines as F3XReceiptLines,
  disbursementLines as F3XDisbursementLines,
  thirdLines as F3XContributionsExpendituresLines,
} from './f3x-detailed-line-summaries';

import {
  receiptLines as F3ReceiptLines,
  disbursementLines as F3DisbursementLines,
  thirdLines as F3CashSummaryLines,
} from './f3-detailed-line-summaries';
import { Form3 } from 'app/shared/models/reports/form-3.model';
import { BaseSummaryComponent } from '../base-summary.component';
import { SharedSummaryTemplatesComponent } from '../shared-summary-templates.component';

@Component({
  selector: 'app-report-detailed-summary',
  templateUrl: './report-detailed-summary.component.html',
  styleUrls: ['./report-detailed-summary.component.scss', '../summaries.scss'],
  imports: [ButtonDirective, Ripple, TableModule, TableComponent, SharedSummaryTemplatesComponent],
})
export class ReportDetailedSummaryComponent extends BaseSummaryComponent {
  readonly receiptLines = computed(() => {
    const report = this.report();
    return this.isF3X() ? F3XReceiptLines(report as Form3X) : F3ReceiptLines(report as Form3);
  });

  readonly disbursementLines = computed(() => {
    const report = this.report();
    return this.isF3X() ? F3XDisbursementLines(report as Form3X) : F3DisbursementLines(report as Form3);
  });
  readonly thirdLines = computed(() =>
    this.isF3X()
      ? F3XContributionsExpendituresLines(this.report() as Form3X)
      : F3CashSummaryLines(this.report() as Form3),
  );
  readonly thirdTitle = computed(() => (this.isF3X() ? 'Net contributions/operating expenditures' : 'Cash summary'));
}
