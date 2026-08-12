import { Form3 } from 'app/shared/models/reports/form-3.model';
import { LineSummary } from '../base-summary.component';

export function receiptLines(report: Form3): LineSummary[] {
  return [
    {
      lineNumber: '11',
      description: `CONTRIBUTIONS (OTHER THAN LOANS)`,
      bold: true,
    },
    {
      lineNumber: '11(a)',
      description: 'Individuals/persons other than political committees',
      indent: 1,
    },
    {
      lineNumber: '11(a)(i)',
      description: 'Itemized (use Schedule A)',
      indent: 2,
      italic: true,
      thisPeriod: report.L11ai_individuals_itemized_period,
      yearToDate: report.L11ai_individuals_itemized_ytd,
    },
    {
      lineNumber: '11(a)(ii)',
      description: 'Unitemized',
      thisPeriod: report.L11aii_individuals_unitemized_period,
      indent: 2,
      italic: true,
      yearToDate: report.L11aii_individuals_unitemized_ytd,
    },
    {
      lineNumber: '11(a)(iii)',
      description: 'Total contributions from individuals/persons other than political committees',
      thisPeriod: report.L11aiii_total_individual_period,
      indent: 2,
      italic: true,
      overlay: 'Lines 11(a)(i) + 11(a)(ii) = Line 11(a)(iii)',
      yearToDate: report.L11aiii_total_individual_ytd,
    },
    {
      lineNumber: '11(b)',
      description: 'Political party committees',
      indent: 1,
      thisPeriod: report.L11b_political_party_committees_period,
      yearToDate: report.L11b_political_party_committees_ytd,
    },
    {
      lineNumber: '11(c)',
      description: 'Other political committees (Such as PACs)',
      indent: 1,
      thisPeriod: report.L11c_other_political_committees_period,
      yearToDate: report.L11c_other_political_committees_ytd,
    },
    {
      lineNumber: '11(d)',
      description: 'The Candidate',
      indent: 1,
      thisPeriod: report.L11d_the_candidate_period,
      yearToDate: report.L11d_the_candidate_ytd,
    },
    {
      lineNumber: '11(e)',
      description: 'Total contributions',
      indent: 1,
      overlay: 'Lines 11(a)(iii) + 11(b) + 11(c) = Line 11(d)\n(This total will also appear on Line 33).',
      thisPeriod: report.L11e_total_contributions_period,
      yearToDate: report.L11e_total_contributions_ytd,
    },
    {
      lineNumber: '12',
      description: 'TRANSFERS FROM OTHER AUTHORIZED COMMITTEES',
      bold: true,
      thisPeriod: report.L12_transfers_from_other_authorized_committees_period,
      yearToDate: report.L12_transfers_from_other_authorized_committees_ytd,
    },
    {
      lineNumber: '13',
      description: 'LOANS',
      bold: true,
    },
    {
      lineNumber: '13(a)',
      description: 'All other loans',
      indent: 1,
      thisPeriod: report.L13b_all_other_loans_period,
      yearToDate: report.L13b_all_other_loans_ytd,
    },
    {
      lineNumber: '13(b)',
      description: 'Made or guaranteed by the candidate',
      indent: 1,
      thisPeriod: report.L13a_loans_made_or_guaranteed_by_the_candidate_period,
      yearToDate: report.L13a_loans_made_or_guaranteed_by_the_candidate_ytd,
    },
    {
      lineNumber: '13(c)',
      description: 'Total loans',
      indent: 1,
      thisPeriod: report.L13c_total_loans_period,
      yearToDate: report.L13c_total_loans_ytd,
    },
    {
      lineNumber: '14',
      description: 'OFFSETS TO OPERATING EXPENDITURES (REFUNDS, REBATES, ETC.)',
      bold: true,
      thisPeriod: report.L14_offsets_to_operating_expenditures_period,
      yearToDate: report.L14_offsets_to_operating_expenditures_ytd,
    },
    {
      lineNumber: '15',
      description: 'OTHER RECEIPTS (DIVIDENDS, INTEREST, ETC.)',
      bold: true,
      thisPeriod: report.L15_other_receipts_period,
      yearToDate: report.L15_other_receipts_ytd,
    },
    {
      lineNumber: '16',
      description: 'TOTAL RECEIPTS',
      bold: true,
      overlay: 'Lines 11(e) + 12 + 13(c) + 14 + 15 = Line 16 (This total will also appear on Line 24)',
      thisPeriod: report.L16_total_receipts_period,
      yearToDate: report.L16_total_receipts_ytd,
    },
  ];
}

export function disbursementLines(report: Form3): LineSummary[] {
  return [
    {
      lineNumber: '17',
      description: `OPERATING EXPENDITURES`,
      bold: true,
      thisPeriod: report.L17_operating_expenditures_period,
      yearToDate: report.L17_operating_expenditures_ytd,
    },
    {
      lineNumber: '18',
      description: 'TRANSFERS TO OTHER AUTHORIZED COMMITTEES',
      bold: true,
      thisPeriod: report.L18_transfers_to_other_authorized_committees_period,
      yearToDate: report.L18_transfers_to_other_authorized_committees_ytd,
    },
    {
      lineNumber: '19',
      description: 'LOAN REPAYMENTS',
      bold: true,
    },
    {
      lineNumber: '19(a)',
      description: 'Of Loans Made or Guaranteed by the Candidate',
      indent: 1,
      thisPeriod: report.L19a_loan_repayments_of_loans_made_or_guaranteed_by_candidate_period,
      yearToDate: report.L19a_loan_repayments_of_loans_made_or_guaranteed_by_candidate_ytd,
    },
    {
      lineNumber: '19(b)',
      description: 'Of all other loans',
      indent: 1,
      thisPeriod: report.L19b_loan_repayments_of_all_other_loans_period,
      yearToDate: report.L19b_loan_repayments_of_all_other_loans_ytd,
    },
    {
      lineNumber: '19(c)',
      description: 'Total Loan Repayments',
      indent: 1,
      overlay: 'Lines 19(a) + 19(b) = Line 19(c)',
      thisPeriod: report.L19c_total_loan_repayments_period,
      yearToDate: report.L19c_total_loan_repayments_ytd,
    },
    {
      lineNumber: '20',
      description: 'REFUNDS OF CONTRIBUTIONS TO',
      bold: true,
    },
    {
      lineNumber: '20(a)',
      description: 'Individuals/Persons Other Than Political Committees',
      indent: 1,
      thisPeriod: report.L20a_refunds_to_individuals_period,
      yearToDate: report.L20a_refunds_to_individuals_ytd,
    },
    {
      lineNumber: '20(b)',
      description: 'Political Party Committees',
      indent: 1,
      thisPeriod: report.L20b_refunds_to_political_party_committees_period,
      yearToDate: report.L20b_refunds_to_political_party_committees_ytd,
    },
    {
      lineNumber: '20(c)',
      description: 'Other Political Committees (such as PACs)',
      indent: 1,
      thisPeriod: report.L20c_refunds_to_other_political_committees_period,
      yearToDate: report.L20c_refunds_to_other_political_committees_ytd,
    },
    {
      lineNumber: '20(d)',
      description: 'Total Contribution Refunds',
      indent: 1,
      overlay: 'Lines 20(a) + 20(b) + 20(c) = Line 20(d)',
      thisPeriod: report.L20d_total_contribution_refunds_period,
      yearToDate: report.L20d_total_contribution_refunds_ytd,
    },
    {
      lineNumber: '21',
      description: 'OTHER DISBURSEMENTS',
      bold: true,
      thisPeriod: report.L21_other_disbursements_period,
      yearToDate: report.L21_other_disbursements_ytd,
    },
    {
      lineNumber: '22',
      description: 'TOTAL DISBURSEMENTS',
      bold: true,
      overlay: 'Lines 17 + 18 + 19(c) + 20(d) + 21 = Line 22',
      thisPeriod: report.L22_total_disbursements_period,
      yearToDate: report.L22_total_disbursements_ytd,
    },
  ];
}

export function thirdLines(report: Form3): LineSummary[] {
  return [
    {
      lineNumber: '23',
      description: `CASH ON HAND AT BEGINNING OF REPORTING PERIOD`,
      bold: true,
      thisPeriod: report.L23_cash_on_hand_beginning_reporting_period,
    },
    {
      lineNumber: '24',
      description: 'TOTAL RECEIPTS THIS PERIOD',
      bold: true,
      overlay: 'Carried from Line 16.',
      thisPeriod: report.L24_total_receipts_period,
    },
    {
      lineNumber: '25',
      description: 'SUBTOTAL',
      bold: true,
      overlay: 'Lines 23 + 24 = Line 25',
      thisPeriod: report.L25_subtotals_period,
    },
    {
      lineNumber: '26',
      description: 'TOTAL DISBURSEMENTS THIS PERIOD',
      bold: true,
      overlay: 'Carried from Line 22.',
      thisPeriod: report.L26_total_disbursements_period,
    },
    {
      lineNumber: '27',
      description: 'CASH ON HAND AT CLOSE OF REPORTING PERIOD',
      bold: true,
      overlay: 'Lines 25 - 26 = Line 27',
      thisPeriod: report.L27_cash_on_hand_at_close_period,
    },
  ];
}
