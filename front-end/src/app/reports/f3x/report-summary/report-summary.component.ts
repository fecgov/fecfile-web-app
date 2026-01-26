import { Component, computed, Signal, signal } from '@angular/core';
import { ReportDetailedSummaryComponent } from '../report-detailed-summary/report-detailed-summary.component';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { ColumnDefinition, TableComponent } from 'app/shared/components/table/table.component';

interface LineSummary {
  lineNumber: string;
  description: string;
  thisPeriod?: number;
  yearToDate?: number;
}

@Component({
  selector: 'app-report-summary',
  templateUrl: './report-summary.component.html',
  styleUrls: ['./report-summary.component.scss'],
  imports: [ButtonDirective, Ripple, TableModule, TableComponent],
})
export class ReportSummaryComponent extends ReportDetailedSummaryComponent {
  readonly lines = computed(() => {
    const report = this.report();
    const lineSummaries: LineSummary[] = [
      {
        lineNumber: '6(a)',
        description: `Cash on hand January 1, ${report.L6a_year_for_above_ytd}`,
        yearToDate: report.L6a_cash_on_hand_jan_1_ytd,
      },
      {
        lineNumber: '6(b)',
        description: 'Cash on hand at beginning of reporting period',
        thisPeriod: report.L6b_cash_on_hand_beginning_period,
      },
      {
        lineNumber: '6(c)',
        description: 'Total receipts (from Line 19)',
        thisPeriod: report.L19_total_receipts_period,
        yearToDate: report.L19_total_receipts_ytd,
      },
      {
        lineNumber: '6(d)',
        description: 'Subtotal (add Lines 6(b) and 6(c) for Column A and Lines 6(a) and 6(c) from Column B)',
        thisPeriod: report.L6d_subtotal_period,
        yearToDate: report.L6d_subtotal_ytd,
      },
      {
        lineNumber: '7',
        description: 'Total disbursements (from Line 31)',
        thisPeriod: report.L7_total_disbursements_period,
        yearToDate: report.L7_total_disbursements_ytd,
      },
      {
        lineNumber: '8',
        description: 'Cash on hand at close of reporting period (subtract Line 7 from Line 6(d))',
        thisPeriod: report.L8_cash_on_hand_at_close_period,
        yearToDate: report.L8_cash_on_hand_close_ytd,
      },
      {
        lineNumber: '9',
        description: 'Debts and obligations owed TO the committee (Itemize all on Schedule C and/or Schedule D)',
        thisPeriod: report.L9_debts_to_period,
      },
      {
        lineNumber: '10',
        description: 'Debts and obligations owed BY the committee (Itemized all on Schedule C and/or Schedule D)',
        thisPeriod: report.L10_debts_by_period,
      },
    ];

    return lineSummaries;
  });

  readonly first = signal(0);
  readonly columns: Signal<ColumnDefinition<LineSummary>[]> = computed(() => {
    const columns = [
      { field: 'lineNumber', header: 'Line', cssClass: 'line-column' },
      { field: 'description', header: 'Description', cssClass: 'description-column' },
      { field: 'thisPeriod', header: 'This Period', cssClass: 'period-column', pipes: ['currency'] },
      {
        field: 'yearToDate',
        header: 'Calendar Year-to-Date',
        cssClass: 'ytd-column',
        pipes: ['currency'],
      },
    ];

    return columns;
  });
}
