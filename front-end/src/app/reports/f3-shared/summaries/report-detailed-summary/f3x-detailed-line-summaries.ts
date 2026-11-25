import { Form3X } from 'app/shared/models/reports/form-3x.model';
import { lineHeading, lineSummary, LineSummary } from 'app/shared/models/reports/lines.model';

export function getF3XLines(report: Form3X) {
  return { receipts: receiptLines(report), disbursements: disbursementLines(report), third: thirdLines(report) };
}

function receiptLines(report: Form3X): LineSummary[] {
  return [
    lineHeading('11', 'CONTRIBUTIONS (OTHER THAN LOANS)', { bold: true }),
    lineHeading('11(a)', 'Individuals/persons other than political committees', { indent: 1 }),
    lineSummary(report, 'L11ai', '11(a)(i)', 'Itemized (use Schedule A)', {
      indent: 2,
      italic: true,
    }),
    lineSummary(report, 'L11aii', '11(a)(ii)', 'Unitemized', {
      indent: 2,
      italic: true,
    }),
    lineSummary(
      report,
      'L11aiii',
      '11(a)(iii)',
      'Total contributions from individuals/persons other than political committees',
      {
        indent: 2,
        italic: true,
        overlay: 'Lines 11(a)(i) + 11(a)(ii) = Line 11(a)(iii)',
      },
    ),
    lineSummary(report, 'L11b', '11(b)', 'Political party committees', { indent: 1 }),
    lineSummary(report, 'L11c', '11(c)', 'Other political committees (Such as PACs)', { indent: 1 }),
    lineSummary(report, 'L11d', '11(d)', 'Total contributions', {
      indent: 1,
      overlay: 'Lines 11(a)(iii) + 11(b) + 11(c) = Line 11(d)\n(This total will also appear on Line 33).',
    }),
    lineSummary(report, 'L12', '12', 'TRANSFERS FROM AFFILIATED/OTHER PARTY COMMITTEES', { bold: true }),
    lineSummary(report, 'L13', '13', 'ALL LOANS RECEIVED', { bold: true }),
    lineSummary(report, 'L14', '14', 'LOAN REPAYMENTS RECEIVED', { bold: true }),
    lineSummary(report, 'L15', '15', 'OFFSETS TO OPERATING EXPENDITURES (REFUNDS, REBATES, ETC.)', {
      bold: true,
      overlay: '(This total will also appear on Line 37).',
    }),
    lineSummary(
      report,
      'L16',
      '16',
      'REFUNDS OF CONTRIBUTIONS MADE TO FEDERAL CANDIDATES AND OTHER POLITICAL COMMITTEES',
      {
        bold: true,
      },
    ),
    lineSummary(report, 'L17', '17', 'OTHER FEDERAL RECEIPTS (DIVIDENDS, INTEREST, ETC.)', { bold: true }),
    lineHeading('18', 'TRANSFERS FROM NON-FEDERAL AND LEVIN FUNDS', { bold: true }),
    lineSummary(report, 'L18a', '18(a)', 'Non-federal account (from Schedule H3)', { indent: 1 }),
    lineSummary(report, 'L18b', '18(b)', 'Levin funds (from Schedule H5)', { indent: 1 }),
    lineSummary(report, 'L18c', '18(c)', 'Total transfers', {
      indent: 1,
      overlay: 'Lines 18(a) <b>+</b> 18(b) <b>=</b> Line 18(c)',
    }),
    lineSummary(report, 'L19', '19', 'TOTAL RECEIPTS', {
      bold: true,
      overlay: 'Lines 11(d) + 12 + 13 + 14 + 15 + 16 + 17 + 18(c) = Line 19',
    }),
    lineSummary(report, 'L20', '20', 'TOTAL FEDERAL RECEIPTS', {
      bold: true,
      overlay: 'Lines 19 - 18(c) = Line 20',
    }),
  ];
}

function disbursementLines(report: Form3X): LineSummary[] {
  return [
    lineHeading('21', 'OPERATING EXPENDITURE', { bold: true }),
    lineHeading('21(a)', 'Allocated Federal/Non-Federal Activity (from Schedule H4)', {
      indent: 1,
      italic: true,
    }),
    lineSummary(report, 'L21ai', '21(a)(i)', 'Federal Share', { indent: 2 }),
    lineSummary(report, 'L21aii', '21(a)(ii)', 'Non-Federal Share', { indent: 2 }),
    lineSummary(report, 'L21b', '21(b)', 'Other federal operating expenditures', { indent: 1 }),
    lineSummary(report, 'L21c', '21(c)', 'Total operating expenditures', {
      indent: 1,
      overlay: 'Lines 21(a)(i) + 21(a)(ii) + 21(b) = Line 21(c)',
    }),
    lineSummary(report, 'L22', '22', 'TRANSFERS FROM AFFILIATED/OTHER PARTY COMMITTEES', { bold: true }),
    lineSummary(report, 'L23', '23', 'CONTRIBUTIONS TO FEDERAL CANDIDATES/COMMITTEES AND OTHER POLITICAL COMMITTEES', {
      bold: true,
    }),
    lineSummary(report, 'L24', '24', 'INDEPENDENT EXPENDITURES (use Schedule E)', { bold: true }),
    lineSummary(report, 'L25', '25', 'COORDINATED PARTY EXPENDITURES (52 U.S.C. § 30116(D)) (use Schedule F)', {
      bold: true,
    }),
    lineSummary(report, 'L26', '26', 'LOANS REPAYMENTS MADE', { bold: true }),
    lineSummary(report, 'L27', '27', 'LOAN MADE', { bold: true }),
    lineHeading('28', 'REFUNDS OF CONTRIBUTIONS', { bold: true }),
    lineSummary(report, 'L28a', '28(a)', 'Individuals/persons other than political committees', { indent: 1 }),
    lineSummary(report, 'L28b', '28(b)', 'Political Party Committees', { indent: 1 }),
    lineSummary(report, 'L28c', '28(c)', 'Other Political Committees (such as PACs)', { indent: 1 }),
    lineSummary(report, 'L28d', '28(d)', 'Total Contribution Refunds', {
      indent: 1,
      overlay: 'Lines 28(a) + 28(b) + 28(c) = Line 28(d)',
    }),
    lineSummary(report, 'L29', '29', 'OTHER DISBURSEMENTS (INCLUDING NON-FEDERAL DONATIONS)', { bold: true }),
    lineHeading('30', 'FEDERAL ELECTION ACTIVITY (52 U.S.C. § 30101(20))', { bold: true }),
    lineHeading('30(a)', 'Allocated Federal Election Activity (use Schedule H6)', { indent: 1 }),
    lineSummary(report, 'L30ai', '30(a)(i)', 'Federal share', { indent: 2 }),
    lineSummary(report, 'L30aii', '30(a)(ii)', '"Levin" share', { indent: 2 }),
    lineSummary(report, 'L30b', '30(b)', 'Federal Election Activity Paid Entirely With Federal Funds', {
      indent: 1,
    }),
    lineSummary(report, 'L30c', '30(c)', 'Total Federal Election Activity', {
      indent: 1,
      overlay: 'Lines 30(a)(i) + 30(a)(ii) + 30(b) = Line 30(c)',
    }),
    lineSummary(report, 'L31', '31', 'TOTAL DISBURSEMENTS', {
      bold: true,
      overlay: 'Lines 21(c) + 22 + 23 + 24 + 25 + 26 + 27 + 28(d) + 29 + 30(c) = Line 31',
    }),
    lineSummary(report, 'L32', '32', 'TOTAL FEDERAL DISBURSEMENTS', {
      bold: true,
      overlay: 'Lines 31 - 21(a)(ii) + 30(a)(ii) = Line 32',
    }),
  ];
}

function thirdLines(report: Form3X): LineSummary[] {
  return [
    lineSummary(report, 'L33', '33', 'TOTAL CONTRIBUTIONS', { bold: true, overlay: 'Carried from Line 11(d)' }),
    lineSummary(report, 'L34', '34', 'TOTAL CONTRIBUTION REFUNDS', { bold: true, overlay: 'Carried from Line 28(d)' }),
    lineSummary(report, 'L35', '35', 'NET CONTRIBUTIONS (OTHER THAN LOANS)', {
      bold: true,
      overlay: 'Line 33 - 34 = Line 35',
    }),
    lineSummary(report, 'L36', '36', 'TOTAL FEDERAL OPERATING EXPENDITURES', {
      bold: true,
      overlay: 'Line 21(a)(i) + 21(b) = Line 36',
    }),
    lineSummary(report, 'L37', '37', 'OFFSETS TO OPERATING EXPENDITURES', {
      bold: true,
      overlay: 'Carried from Line 15',
    }),
    lineSummary(report, 'L38', '38', 'NET OPERATING EXPENDITURE', {
      bold: true,
      overlay: 'Line 37 - 36 = Line 38',
    }),
  ];
}
