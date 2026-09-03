import { Component, computed } from '@angular/core';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { TableComponent } from 'app/shared/components/table/table.component';
import { Form3X } from 'app/shared/models/reports/form-3x.model';
import { Form3 } from 'app/shared/models/reports/form-3.model';
import { BaseSummaryComponent, LineSummary } from '../base-summary.component';
import { SharedSummaryTemplatesComponent } from '../shared-summary-templates.component';

@Component({
  selector: 'app-report-summary',
  templateUrl: './report-summary.component.html',
  styleUrls: ['../summaries.scss'],
  imports: [ButtonDirective, Ripple, TableModule, TableComponent, SharedSummaryTemplatesComponent],
})
export class ReportSummaryComponent extends BaseSummaryComponent {
  readonly lines = computed(() => {
    const report = this.report();
    return this.isF3X() ? getF3XLineSummaries(report as Form3X) : getF3LineSummaries(report as Form3);
  });
}

function getF3XLineSummaries(report: Form3X): LineSummary[] {
  return [
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
}

function getF3LineSummaries(report: Form3): LineSummary[] {
  return [
    {
      lineNumber: '6',
      description: 'Net Contributions (other than loans)',
      bold: true,
    },
    {
      lineNumber: '6(a)',
      description: 'Total Contributions (other than loans)',
      thisPeriod: report.L6a_total_contributions_period,
      yearToDate: report.L6a_total_contributions_ytd,
    },
    {
      lineNumber: '6(b)',
      description: 'Total Contributions Refunds',
      thisPeriod: report.L6b_total_contribution_refunds_period,
      yearToDate: report.L6b_total_contribution_refunds_ytd,
    },
    {
      lineNumber: '6(c)',
      description: 'Net Contributions (other than loans)',
      thisPeriod: report.L6c_net_contributions_period,
      yearToDate: report.L6c_net_contributions_ytd,
    },
    {
      lineNumber: '7',
      description: 'Net Operating Expenditures',
      bold: true,
    },
    {
      lineNumber: '7(a)',
      description: 'Total Operating Expenditures',
      thisPeriod: report.L7a_total_operating_expenditures_period,
      yearToDate: report.L7a_total_operating_expenditures_ytd,
    },
    {
      lineNumber: '7(b)',
      description: 'Total Offsets to Operating Expenditures',
      thisPeriod: report.L7b_total_offsets_to_operating_expenditures_period,
      yearToDate: report.L7b_total_offsets_to_operating_expenditures_ytd,
    },
    {
      lineNumber: '7(c)',
      description: 'Net Operating Expenditures',
      overlay: 'Line 7(a) - Line 7(b) = Line 7(c)',
      thisPeriod: report.L7c_net_operating_expenditures_period,
      yearToDate: report.L7c_net_operating_expenditures_ytd,
    },
    {
      lineNumber: '8',
      description: 'Cash on hand at close of reporting period',
      thisPeriod: report.L8_cash_on_hand_at_close_period,
    },
    {
      lineNumber: '9',
      description: 'Debts and obligations owed TO the committee',
      thisPeriod: report.L9_debts_owed_to_committee_period,
    },
    {
      lineNumber: '10',
      description: 'Debts and obligations owed BY the committee',
      thisPeriod: report.L10_debts_owed_by_committee_period,
    },
  ];
}
