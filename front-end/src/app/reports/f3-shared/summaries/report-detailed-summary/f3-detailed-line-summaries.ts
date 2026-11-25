import { Form3 } from 'app/shared/models/reports/form-3.model';
import { lineHeading, LineSummary, lineSummary } from 'app/shared/models/reports/lines.model';

export function getF3Lines(report: Form3) {
  return { receipts: receiptLines(report), disbursements: disbursementLines(report), third: thirdLines(report) };
}

function receiptLines(report: Form3): LineSummary[] {
  return [
    lineHeading('11a)', 'Individuals/persons other than political committees', { indent: 1 }),
    lineSummary(report, 'L11ai', '11(a)(i)', 'Itemized (use Schedule A)', { indent: 2 }),
    lineSummary(report, 'L11aii', '11(a)(ii)', 'Unitemized', {
      indent: 2,
      italic: true,
    }),
    lineSummary(
      report,
      'L11aiii',
      '11(a)(iii)',
      'Total contributions from individuals/persons other than political committees',
      { indent: 2, italic: true, overlay: 'Lines 11(a)(i) + 11(a)(ii) = Line 11(a)(iii)' },
    ),
    lineSummary(report, 'L11b', '11(b)', 'Political party committees', { indent: 1 }),
    lineSummary(report, 'L11c', '11(c)', 'Other political committees (Such as PACs)', { indent: 1 }),
    lineSummary(report, 'L11d', '11(d)', 'The Candidate', { indent: 1 }),
    lineSummary(report, 'L11e', '11(e)', 'Total contributions', {
      indent: 1,
      overlay: 'Lines 11(a)(iii) + 11(b) + 11(c) = Line 11(d)\n(This total will also appear on Line 33).',
    }),

    lineSummary(report, 'L12', '12', 'TRANSFERS FROM OTHER AUTHORIZED COMMITTEES', { bold: true }),
    lineHeading('13', 'LOANS', { bold: true }),
    lineSummary(report, 'L13a', '13(a)', 'Made or guaranteed by the candidate', { indent: 1 }),
    lineSummary(report, 'L13b', '13(b)', 'All other loans', { indent: 1 }),
    lineSummary(report, 'L13c', '13(c)', 'Total loans', { indent: 1 }),
    lineSummary(report, 'L14', '14', 'OFFSETS TO OPERATING EXPENDITURES (REFUNDS, REBATES, ETC.)', { bold: true }),
    lineSummary(report, 'L15', '15', 'OTHER RECEIPTS (DIVIDENDS, INTEREST, ETC.)', { bold: true }),
    lineSummary(report, 'L16', '16', 'TOTAL RECEIPTS', {
      bold: true,
      overlay: 'Lines 11(e) + 12 + 13(c) + 14 + 15 = Line 16 (This total will also appear on Line 24)',
    }),
  ];
}

function disbursementLines(report: Form3): LineSummary[] {
  return [
    lineSummary(report, 'L17', '17', 'OPERATING EXPENDITURES', { bold: true }),
    lineSummary(report, 'L18', '18', 'TRANSFERS TO OTHER AUTHORIZED COMMITTEES', { bold: true }),
    lineHeading('19', 'LOAN REPAYMENTS', { bold: true }),
    lineSummary(report, 'L19a', '19(a)', 'Of Loans Made or Guaranteed by the Candidate', { indent: 1 }),
    lineSummary(report, 'L19b', '19(b)', 'Of all other loans', { indent: 1 }),
    lineSummary(report, 'L19c', '19(c)', 'Total Loan Repayments', {
      indent: 1,
      overlay: 'Lines 19(a) + 19(b) = Line 19(c)',
    }),
    lineHeading('20', 'REFUNDS OF CONTRIBUTIONS TO', { bold: true }),
    lineSummary(report, 'L20a', '20(a)', 'Individuals/Persons Other Than Political Committees', { indent: 1 }),
    lineSummary(report, 'L20b', '20(b)', 'Political Party Committees', { indent: 1 }),
    lineSummary(report, 'L20c', '20(c)', 'Other Political Committees (such as PACs)', { indent: 1 }),
    lineSummary(report, 'L20d', '20(d)', 'Total Contribution Refunds', {
      indent: 1,
      overlay: 'Lines 20(a) + 20(b) + 20(c) = Line 20(d)',
    }),
    lineSummary(report, 'L21', '21', 'OTHER DISBURSEMENTS', { bold: true }),
    lineSummary(report, 'L22', '22', 'TOTAL DISBURSEMENTS', {
      bold: true,
      overlay: 'Lines 17 - 18 + 19(c) + 20(d) + 21 = Line 22',
    }),
  ];
}

function thirdLines(report: Form3): LineSummary[] {
  return [
    lineSummary(report, 'L23', '23', 'CASH ON HAND AT BEGINNING OF REPORTING PERIOD', { bold: true }),
    lineSummary(report, 'L24', '24', 'TOTAL RECEIPTS THIS PERIOD', {
      bold: true,
      overlay: 'Carried from Line 16.',
    }),
    lineSummary(report, 'L25', '25', 'SUBTOTAL', {
      bold: true,
      overlay: 'Lines 23 + 24 = Line 25',
    }),
    lineSummary(report, 'L26', '26', 'TOTAL DISBURSEMENTS THIS PERIOD', {
      bold: true,
      overlay: 'Carried from Line 22.',
    }),
    lineSummary(report, 'L27', '27', 'CASH ON HAND AT CLOSE OF REPORTING PERIOD', {
      bold: true,
      overlay: 'Lines 25 - 26 = Line 27',
    }),
  ];
}
