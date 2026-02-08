import { Component, computed, effect, inject, signal, Signal } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { Form3X } from 'app/shared/models/reports/form-3x.model';
import { ApiService } from 'app/shared/services/api.service';
import { ReportService } from 'app/shared/services/report.service';
import { Card } from 'primeng/card';
import { CurrencyPipe, NgClass } from '@angular/common';
import { CalculationOverlayComponent } from '../../../shared/components/calculation-overlay/calculation-overlay.component';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { DefaultZeroPipe } from '../../../shared/pipes/default-zero.pipe';
import { ColumnDefinition, TableComponent } from 'app/shared/components/table/table.component';
import { TableModule } from 'primeng/table';

interface DetailedLineSummary {
  lineNumber: string;
  description: string;
  thisPeriod?: number;
  yearToDate?: number;
  cssClass?: string;
  overlay?: string;
  indent?: number;
}

@Component({
  selector: 'app-report-detailed-summary',
  templateUrl: './report-detailed-summary.component.html',
  styleUrls: ['../../styles.scss', './report-detailed-summary.component.scss'],
  imports: [
    Card,
    CalculationOverlayComponent,
    ButtonDirective,
    Ripple,
    CurrencyPipe,
    DefaultZeroPipe,
    TableModule,
    TableComponent,
    NgClass,
  ],
})
export class ReportDetailedSummaryComponent {
  private readonly store = inject(Store);
  public readonly router = inject(Router);
  private readonly apiService = inject(ApiService);
  private readonly reportService = inject(ReportService);
  readonly activeReport = this.store.selectSignal(selectActiveReport);
  readonly report = computed(() => this.activeReport() as Form3X);
  readonly calculationFinished = computed(() => this.report().calculation_status === 'SUCCEEDED');

  readonly receiptLines = computed(() => {
    const report = this.report();
    const lineSummaries: DetailedLineSummary[] = [
      {
        lineNumber: '11',
        description: `CONTRIBUTIONS (OTHER THAN LOANS)`,
        cssClass: 'gray',
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
        thisPeriod: report.L11ai_itemized_period,
        yearToDate: report.L11ai_itemized_ytd,
      },
      {
        lineNumber: '11(a)(ii)',
        description: 'Unitemized',
        thisPeriod: report.L11aii_unitemized_period,
        indent: 2,
        yearToDate: report.L11aii_unitemized_ytd,
      },
      {
        lineNumber: '11(a)(iii)',
        description: 'Total contributions from individuals/persons other than political committees',
        thisPeriod: report.L11aiii_total_period,
        indent: 2,
        overlay: 'Lines 11(a)(i) + 11(a)(ii) = Line 11(a)(iii)',
        yearToDate: report.L11aiii_total_ytd,
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
        thisPeriod: report.L11c_other_political_committees_pacs_period,
        yearToDate: report.L11c_other_political_committees_pacs_ytd,
      },
      {
        lineNumber: '11(d)',
        description: 'Total contributions',
        indent: 1,
        overlay: 'Lines 11(a)(iii) + 11(b) + 11(c) = Line 11(d) (This total will also appear on Line 33).',
        thisPeriod: report.L11d_total_contributions_period,
        yearToDate: report.L11d_total_contributions_ytd,
      },
      {
        lineNumber: '12',
        description: 'TRANSFERS FROM AFFILIATED/OTHER PARTY COMMITTEES',
        thisPeriod: report.L12_transfers_from_affiliated_other_party_cmtes_period,
        yearToDate: report.L12_transfers_from_affiliated_other_party_cmtes_ytd,
      },
      {
        lineNumber: '13',
        description: 'ALL LOANS RECEIVED',
        thisPeriod: report.L13_all_loans_received_period,
        yearToDate: report.L13_all_loans_received_ytd,
      },
      {
        lineNumber: '14',
        description: 'LOAN REPAYMENTS RECEIVED',
        thisPeriod: report.L14_loan_repayments_received_period,
        yearToDate: report.L14_loan_repayments_received_ytd,
      },
      {
        lineNumber: '15',
        description: 'OFFSETS TO OPERATING EXPENDITURES (REFUNDS, REBATES, ETC.)',
        // Overlay
        thisPeriod: report.L14_loan_repayments_received_period,
        yearToDate: report.L14_loan_repayments_received_ytd,
      },
      {
        lineNumber: '16',
        description: 'REFUNDS OF CONTRIBUTIONS MADE TO FEDERAL CANDIDATES AND OTHER POLITICAL COMMITTEES',
        thisPeriod: report.L16_refunds_of_federal_contributions_period,
        yearToDate: report.L16_refunds_of_federal_contributions_ytd,
      },
      {
        lineNumber: '17',
        description: 'OTHER FEDERAL RECEIPTS (DIVIDENDS, INTEREST, ETC.)',
        thisPeriod: report.L17_other_federal_receipts_dividends_period,
        yearToDate: report.L17_other_federal_receipts_dividends_ytd,
      },
      {
        lineNumber: '18',
        description: 'TRANSFERS FROM NON-FEDERAL AND LEVIN FUNDS',
        // Gray
      },
      {
        lineNumber: '18(a)',
        description: 'Non-federal account (from Schedule H3)',
        thisPeriod: report.L18a_transfers_from_nonfederal_account_h3_period,
        yearToDate: report.L18a_transfers_from_nonfederal_account_h3_ytd,
      },
      {
        lineNumber: '18(b)',
        description: 'Levin funds (from Schedule H5)',
        thisPeriod: report.L18b_transfers_from_nonfederal_levin_h5_period,
        yearToDate: report.L18b_transfers_from_nonfederal_levin_h5_ytd,
      },
      {
        lineNumber: '18(c)',
        description: 'Total transfers',
        thisPeriod: report.L18c_total_nonfederal_transfers_18a_18b_period,
        yearToDate: report.L18c_total_nonfederal_transfers_18a_18b_ytd,
      },
      {
        lineNumber: '19',
        description: 'TOTAL RECEIPTS',
        thisPeriod: report.L19_total_receipts_period,
        yearToDate: report.L19_total_receipts_ytd,
      },
      {
        lineNumber: '20',
        description: 'TOTAL FEDERAL RECEIPTS',
        thisPeriod: report.L20_total_federal_receipts_period,
        yearToDate: report.L20_total_federal_receipts_ytd,
      },
    ];

    return lineSummaries;
  });

  readonly disbursementLines = computed(() => {
    const report = this.report();
    const lineSummaries: DetailedLineSummary[] = [
      {
        lineNumber: '21',
        description: `OPERATING EXPENDITURE`,
      },
      {
        lineNumber: '21(a)',
        description: 'Allocated Federal/Non-Federal Activity (from Schedule H4)',
      },
      {
        lineNumber: '21(a)(i)',
        description: 'Federal Share',
        thisPeriod: report.L21ai_federal_share_period,
        yearToDate: report.L21ai_federal_share_ytd,
      },
      {
        lineNumber: '21(a)(ii)',
        description: 'Non-Federal Share',
        thisPeriod: report.L21aii_nonfederal_share_period,
        yearToDate: report.L21aii_nonfederal_share_ytd,
      },
      {
        lineNumber: '21(b)',
        description: 'Other federal operating expenditures',
        thisPeriod: report.L21b_other_federal_operating_expenditures_period,
        yearToDate: report.L21b_other_federal_operating_expenditures_ytd,
      },
      {
        lineNumber: '21(c)',
        description: 'Total operating expenditures',
        // Overlay
        thisPeriod: report.L21c_total_operating_expenditures_period,
        yearToDate: report.L21c_total_operating_expenditures_ytd,
      },
      {
        lineNumber: '22',
        description: 'TRANSFERS FROM AFFILIATED/OTHER PARTY COMMITTEES',
        thisPeriod: report.L22_transfers_to_affiliated_other_party_cmtes_period,
        yearToDate: report.L22_transfers_to_affiliated_other_party_cmtes_ytd,
      },
      {
        lineNumber: '23',
        description: 'CONTRIBUTIONS TO FEDERAL CANDIDATES/COMMITTEES AND OTHER POLITICAL COMMITTEES',
        thisPeriod: report.L23_contributions_to_federal_candidates_cmtes_period,
        yearToDate: report.L23_contributions_to_federal_candidates_cmtes_ytd,
      },
      {
        lineNumber: '24',
        description: 'INDEPENDENT EXPENDITURES (use Schedule E)',
        thisPeriod: report.L24_independent_expenditures_period,
        yearToDate: report.L24_independent_expenditures_ytd,
      },
      {
        lineNumber: '25',
        description: 'COORDINATED PARTY EXPENDITURES (52 U.S.C. § 30116(D)) (use Schedule F)',
        thisPeriod: report.L25_coordinated_expend_made_by_party_cmtes_period,
        yearToDate: report.L25_coordinated_expend_made_by_party_cmtes_ytd,
      },
      {
        lineNumber: '26',
        description: 'LOANS REPAYMENTS MADE',
        thisPeriod: report.L26_loan_repayments_period,
        yearToDate: report.L26_loan_repayments_made_ytd,
      },
      {
        lineNumber: '27',
        description: 'LOAN MADE',
        thisPeriod: report.L27_loans_made_period,
        yearToDate: report.L27_loans_made_ytd,
      },
      {
        lineNumber: '28',
        description: 'REFUNDS OF CONTRIBUTIONS',
      },
      {
        lineNumber: '28(a)',
        description: 'Individuals/persons other than political committees',
        thisPeriod: report.L28a_individuals_persons_period,
        yearToDate: report.L28a_individuals_persons_ytd,
      },
      {
        lineNumber: '28(b)',
        description: 'Political Party Committees',
        thisPeriod: report.L28b_political_party_committees_period,
        yearToDate: report.L28b_political_party_committees_ytd,
      },
      {
        lineNumber: '28(c)',
        description: 'Other Political Committees (such as PACs)',
        thisPeriod: report.L28c_other_political_committees_period,
        yearToDate: report.L28c_other_political_committees_ytd,
      },
      {
        lineNumber: '28(d)',
        description: 'Total Contribution Refunds',
        // Overlay
        thisPeriod: report.L28d_total_contributions_refunds_period,
        yearToDate: report.L28d_total_contributions_refunds_ytd,
      },
      {
        lineNumber: '29',
        description: 'OTHER DISBURSEMENTS (INCLUDING NON-FEDERAL DONATIONS)',
        thisPeriod: report.L29_other_disbursements_period,
        yearToDate: report.L29_other_disbursements_ytd,
      },
      {
        lineNumber: '30',
        description: 'FEDERAL ELECTION ACTIVITY (52 U.S.C. § 30101(20))',
      },
      {
        lineNumber: '30(a)',
        description: 'Allocated Federal Election Activity (use Schedule H6)',
      },
      {
        lineNumber: '30(a)(i)',
        description: 'Federal share',
        thisPeriod: report.L30ai_shared_federal_activity_h6_fed_share_period,
        yearToDate: report.L30ai_shared_federal_activity_h6_fed_share_ytd,
      },
      {
        lineNumber: '30(a)(ii)',
        description: '"Levin" share',
        thisPeriod: report.L30aii_shared_federal_activity_h6_nonfed_period,
        yearToDate: report.L30aii_shared_federal_activity_h6_nonfed_ytd,
      },
      {
        lineNumber: '30(b)',
        description: 'Federal Election Activity Paid Entirely With Federal Funds',
        thisPeriod: report.L30b_nonallocable_fed_election_activity_period,
        yearToDate: report.L30b_nonallocable_fed_election_activity_ytd,
      },
      {
        lineNumber: '30(c)',
        description: 'Total Federal Election Activity',
        // Overlay
        thisPeriod: report.L30c_total_federal_election_activity_period,
        yearToDate: report.L30c_total_federal_election_activity_ytd,
      },
      {
        lineNumber: '31',
        description: 'TOTAL DISBURSEMENTS',
        // Overlay
        thisPeriod: report.L31_total_disbursements_period,
        yearToDate: report.L31_total_disbursements_ytd,
      },
      {
        lineNumber: '32',
        description: 'TOTAL FEDERAL DISBURSEMENTS',
        // Overlay
        thisPeriod: report.L32_total_federal_disbursements_period,
        yearToDate: report.L32_total_federal_disbursements_ytd,
      },
    ];

    return lineSummaries;
  });

  readonly contributionsExpendituresLines = computed(() => {
    const report = this.report();
    const lineSummaries: DetailedLineSummary[] = [
      {
        lineNumber: '33',
        description: `TOTAL CONTRIBUTIONS`,
        // Overlay
        thisPeriod: report.L33_total_contributions_period,
        yearToDate: report.L33_total_contributions_ytd,
      },
      {
        lineNumber: '34',
        description: 'TOTAL CONTRIBUTION REFUNDS',
        // Overlay
        thisPeriod: report.L34_total_contribution_refunds_period,
        yearToDate: report.L34_total_contribution_refunds_ytd,
      },
      {
        lineNumber: '35',
        description: 'NET CONTRIBUTIONS (OTHER THAN LOANS)',
        // Overlay
        thisPeriod: report.L35_net_contributions_period,
        yearToDate: report.L35_net_contributions_ytd,
      },
      {
        lineNumber: '36',
        description: 'TOTAL FEDERAL OPERATING EXPENDITURES',
        // Overlay
        thisPeriod: report.L36_total_federal_operating_expenditures_period,
        yearToDate: report.L36_total_federal_operating_expenditures_ytd,
      },
      {
        lineNumber: '37',
        description: 'OFFSETS TO OPERATING EXPENDITURES',
        // Overlay
        thisPeriod: report.L37_offsets_to_operating_expenditures_period,
        yearToDate: report.L37_offsets_to_operating_expenditures_ytd,
      },
      {
        lineNumber: '38',
        description: 'NET OPERATING EXPENDITURE',
        // Overlay
        thisPeriod: report.L38_net_operating_expenditures_period,
        yearToDate: report.L38_net_operating_expenditures_ytd,
      },
    ];

    return lineSummaries;
  });

  readonly first = signal(0);
  readonly columns: Signal<ColumnDefinition<DetailedLineSummary>[]> = computed(() => {
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

  constructor() {
    effect(async () => {
      const report = this.report();
      if (!report.calculation_status) {
        await this.apiService.post(`/web-services/summary/calculate-summary/`, { report_id: report.id });
        this.refreshSummary();
      } else if (report.calculation_status != 'SUCCEEDED') {
        this.refreshSummary();
      }
    });
  }

  refreshSummary(): void {
    this.reportService.setActiveReportById(this.report().id);
  }
}
