import { Form3X } from 'app/shared/models/reports/form-3x.model';
import { lineHeading, LineSummary, lineSummary } from 'app/shared/models/reports/lines.model';
import type { BaseForm3 } from 'app/shared/models/reports/base-form-3';
import type { Form3 } from 'app/shared/models/reports/form-3.model';

export function getLineSummaries(report: BaseForm3) {
  return report instanceof Form3X ? getF3XLineSummaries(report) : getF3LineSummaries(report as Form3);
}

function getF3XLineSummaries(report: Form3X): LineSummary[] {
  return [
    lineSummary(report, 'L6a', '6(a)', `Cash on hand January 1, ${report.L6a_year_for_above_ytd}`),
    lineSummary(report, 'L6b', '6(b)', 'Cash on hand at beginning of reporting period'),
    lineSummary(report, 'L19', '6(c)', 'Total receipts (from Line 19)'),
    lineSummary(
      report,
      'L6d',
      '6(d)',
      'Subtotal (add Lines 6(b) and 6(c) for Column A and Lines 6(a) and 6(c) from Column B)',
    ),
    lineSummary(report, 'L7', '7', 'Total disbursements (from Line 31)'),
    lineSummary(report, 'L8', '8', 'Cash on hand at close of reporting period (subtract Line 7 from Line 6(d))'),
    lineSummary(
      report,
      'L9',
      '9',
      'Debts and obligations owed TO the committee (Itemize all on Schedule C and/or Schedule D)',
    ),
    lineSummary(
      report,
      'L10',
      '10',
      'Debts and obligations owed BY the committee (Itemized all on Schedule C and/or Schedule D)',
    ),
  ];
}

function getF3LineSummaries(report: Form3): LineSummary[] {
  return [
    lineHeading('6', 'Net Contributions (other than loans)', { bold: true }),
    lineSummary(report, 'L6a', '6(a)', 'Total Contributions (other than loans)'),
    lineSummary(report, 'L6b', '6(b)', 'Total Contributions Refunds'),
    lineSummary(report, 'L6c', '6(c)', 'Net Contributions (other than loans)'),
    lineHeading('7', 'Net Operating Expenditures', { bold: true }),
    lineSummary(report, 'L7a', '7(a)', 'Total Operating Expenditures'),
    lineSummary(report, 'L7b', '7(b)', 'Total Offsets to Operating Expenditures'),
    lineSummary(report, 'L7c', '7(c)', 'Net Operating Expenditures', {
      overlay: 'Line 7(a) - Line 7(b) = Line 7(c)',
    }),
    lineSummary(report, 'L8', '8', 'Cash on hand at close of reporting period'),
    lineSummary(report, 'L9', '9', 'Debts and obligations owed TO the committee'),
    lineSummary(report, 'L10', '10', 'Debts and obligations owed BY the committee'),
  ];
}
