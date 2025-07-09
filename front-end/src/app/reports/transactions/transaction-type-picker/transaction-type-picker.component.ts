import { Component, computed, effect, inject, model, Signal, viewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { ReportTypes } from 'app/shared/models/report.model';
import { TransactionTypes, TransactionGroupTypes } from 'app/shared/models/transaction.model';
import { ScheduleATransactionTypeLabels, ScheduleATransactionTypes } from 'app/shared/models/scha-transaction.model';
import { ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes } from 'app/shared/models/schb-transaction.model';
import { LabelList } from 'app/shared/utils/label.utils';
import {
  PAC_ONLY,
  PTY_ONLY,
  TransactionTypeUtils,
  getTransactionTypeClass,
} from 'app/shared/utils/transaction-type.utils';
import { DestroyerComponent } from 'app/shared/components/app-destroyer.component';
import { ScheduleCTransactionTypeLabels, ScheduleCTransactionTypes } from 'app/shared/models/schc-transaction.model';
import { ScheduleDTransactionTypeLabels, ScheduleDTransactionTypes } from 'app/shared/models/schd-transaction.model';
import { ScheduleETransactionTypeLabels, ScheduleETransactionTypes } from 'app/shared/models/sche-transaction.model';
import { ScheduleFTransactionTypeLabels, ScheduleFTransactionTypes } from 'app/shared/models/schf-transaction.model';
import { selectCommitteeAccount } from 'app/store/committee-account.selectors';
import { Accordion, AccordionModule } from 'primeng/accordion';
import { LabelPipe } from '../../../shared/pipes/label.pipe';
import { environment } from '../../../../environments/environment';
import { toSignal } from '@angular/core/rxjs-interop';
import { Disbursement, LoansAndDebts, Receipt } from 'app/shared/models/transaction-group';
import { scrollToTop } from 'app/shared/utils/form.utils';

type Categories = 'receipt' | 'disbursement' | 'loans-and-debts';

@Component({
  selector: 'app-transaction-type-picker',
  templateUrl: './transaction-type-picker.component.html',
  styleUrls: ['./transaction-type-picker.component.scss'],
  imports: [RouterLink, LabelPipe, AccordionModule],
})
export class TransactionTypePickerComponent extends DestroyerComponent {
  private readonly store = inject(Store);
  private readonly route = inject(ActivatedRoute);
  private readonly titleService = inject(Title);
  private readonly accordion = viewChild.required(Accordion);

  readonly transactionTypeLabels: LabelList = [
    ...ScheduleATransactionTypeLabels,
    ...ScheduleBTransactionTypeLabels,
    ...ScheduleCTransactionTypeLabels,
    ...ScheduleDTransactionTypeLabels,
    ...ScheduleETransactionTypeLabels,
    ...ScheduleFTransactionTypeLabels,
  ];
  private readonly report = this.store.selectSignal(selectActiveReport);
  private readonly params$ = toSignal(this.route.params, { initialValue: { category: 'receipt' } });
  private readonly queryParams$ = toSignal(this.route.queryParamMap);
  readonly category: Signal<Categories> = computed(() => this.params$().category);
  readonly title: Signal<string> = computed(() => {
    switch (this.category()) {
      case 'receipt':
        return this.debtId() ? 'Report debt repayment' : 'Add a receipt';
      case 'disbursement':
        return this.debtId() ? 'Report debt repayment' : 'Add a disbursement';
      case 'loans-and-debts':
        return 'Add loans and debts';
      default:
        return this.category();
    }
  });
  readonly debtId: Signal<string | undefined> = computed(() => this.queryParams$()?.get('debt') ?? undefined);
  private readonly committeeAccount = this.store.selectSignal(selectCommitteeAccount);

  readonly active = model<number>(-1);

  readonly isF3X = computed(() => this.report().report_type === ReportTypes.F3X);
  readonly isF3 = computed(() => this.report().report_type === ReportTypes.F3);

  readonly transactionGroups: Signal<TransactionGroupTypes[]> = computed(() => {
    switch (this.category()) {
      case 'receipt':
        return [
          Receipt.CONTRIBUTIONS_FROM_INDIVIDUALS_PERSONS,
          Receipt.CONTRIBUTIONS_FROM_REGISTERED_FILERS,
          Receipt.TRANSFERS,
          Receipt.REFUNDS,
          Receipt.OTHER,
        ];
      case 'disbursement':
        if (this.isF3() || this.isF3X()) {
          return [
            Disbursement.OPERATING_EXPENDITURES,
            Disbursement.CONTRIBUTIONS_EXPENDITURES_TO_REGISTERED_FILERS,
            Disbursement.OTHER_EXPENDITURES,
            Disbursement.REFUND,
            Disbursement.FEDERAL_ELECTION_ACTIVITY_EXPENDITURES,
          ];
        } else {
          return [];
        }
      case 'loans-and-debts':
        return [LoansAndDebts.LOANS, LoansAndDebts.DEBTS];
    }
  });

  constructor() {
    super();
    effect(() => {
      this.titleService.setTitle(this.title());
    });
    effect(() => {
      if (this.params$() || this.queryParams$()) this.active.set(-1);
    });

    effect(() => {
      this.accordion().value();
      scrollToTop();
    });
  }

  readonly transactionTypes = computed(() => {
    const groups = this.transactionGroups();
    const typeMap = new Map<TransactionGroupTypes, TransactionTypes[]>();
    groups.forEach((group) => {
      let transactionTypes: TransactionTypes[] = [];
      switch (group) {
        case Receipt.CONTRIBUTIONS_FROM_INDIVIDUALS_PERSONS:
          transactionTypes = [
            ScheduleATransactionTypes.INDIVIDUAL_RECEIPT,
            ScheduleATransactionTypes.TRIBAL_RECEIPT,
            ScheduleATransactionTypes.PARTNERSHIP_RECEIPT,
            ScheduleATransactionTypes.IN_KIND_RECEIPT,
            ScheduleATransactionTypes.RETURNED_BOUNCED_RECEIPT_INDIVIDUAL,
            ScheduleATransactionTypes.EARMARK_RECEIPT,
            ScheduleATransactionTypes.CONDUIT_EARMARK_RECEIPT,
            ScheduleATransactionTypes.RECEIPT_FROM_UNREGISTERED_ENTITY,
            ScheduleATransactionTypes.RECEIPT_FROM_UNREGISTERED_ENTITY_RETURN,
          ];
          break;
        case Receipt.CONTRIBUTIONS_FROM_REGISTERED_FILERS:
          transactionTypes = [
            ScheduleATransactionTypes.PARTY_RECEIPT,
            ScheduleATransactionTypes.PARTY_IN_KIND_RECEIPT,
            ScheduleATransactionTypes.PARTY_RETURN,
            ScheduleATransactionTypes.PAC_RECEIPT,
            ScheduleATransactionTypes.PAC_IN_KIND_RECEIPT,
            ScheduleATransactionTypes.PAC_EARMARK_RECEIPT,
            ScheduleATransactionTypes.PAC_CONDUIT_EARMARK,
            ScheduleATransactionTypes.PAC_RETURN,
          ];
          break;
        case Receipt.TRANSFERS:
          transactionTypes = [
            ScheduleATransactionTypes.TRANSFER,
            ScheduleATransactionTypes.JOINT_FUNDRAISING_TRANSFER,
            ScheduleATransactionTypes.IN_KIND_TRANSFER,
            ScheduleATransactionTypes.IN_KIND_TRANSFER_FEDERAL_ELECTION_ACTIVITY,
            ScheduleATransactionTypes.JF_TRANSFER_NATIONAL_PARTY_RECOUNT_ACCOUNT,
            ScheduleATransactionTypes.JF_TRANSFER_NATIONAL_PARTY_CONVENTION_ACCOUNT,
            ScheduleATransactionTypes.JF_TRANSFER_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT,
          ];
          break;
        case Receipt.REFUNDS:
          transactionTypes = [
            ScheduleATransactionTypes.REFUND_TO_FEDERAL_CANDIDATE,
            ScheduleATransactionTypes.REFUND_TO_OTHER_POLITICAL_COMMITTEE,
            ScheduleATransactionTypes.REFUND_TO_UNREGISTERED_COMMITTEE,
          ];
          break;
        case Receipt.OTHER:
          transactionTypes = [
            ScheduleATransactionTypes.OFFSET_TO_OPERATING_EXPENDITURES,
            ScheduleATransactionTypes.OTHER_RECEIPTS,
            ScheduleATransactionTypes.INDIVIDUAL_RECEIPT_NON_CONTRIBUTION_ACCOUNT,
            ScheduleATransactionTypes.OTHER_COMMITTEE_RECEIPT_NON_CONTRIBUTION_ACCOUNT,
            ScheduleATransactionTypes.BUSINESS_LABOR_NON_CONTRIBUTION_ACCOUNT,
            ScheduleATransactionTypes.INDIVIDUAL_RECOUNT_RECEIPT,
            ScheduleATransactionTypes.PARTY_RECOUNT_RECEIPT,
            ScheduleATransactionTypes.PAC_RECOUNT_RECEIPT,
            ScheduleATransactionTypes.TRIBAL_RECOUNT_RECEIPT,
            ScheduleATransactionTypes.PARTNERSHIP_RECOUNT_ACCOUNT_RECEIPT,
            ScheduleATransactionTypes.INDIVIDUAL_NATIONAL_PARTY_RECOUNT_ACCOUNT,
            ScheduleATransactionTypes.PARTY_NATIONAL_PARTY_RECOUNT_ACCOUNT,
            ScheduleATransactionTypes.PAC_NATIONAL_PARTY_RECOUNT_ACCOUNT,
            ScheduleATransactionTypes.TRIBAL_NATIONAL_PARTY_RECOUNT_ACCOUNT,
            ScheduleATransactionTypes.INDIVIDUAL_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT,
            ScheduleATransactionTypes.PARTY_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT,
            ScheduleATransactionTypes.PAC_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT,
            ScheduleATransactionTypes.TRIBAL_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT,
            ScheduleATransactionTypes.INDIVIDUAL_NATIONAL_PARTY_CONVENTION_ACCOUNT,
            ScheduleATransactionTypes.PARTY_NATIONAL_PARTY_CONVENTION_ACCOUNT,
            ScheduleATransactionTypes.PAC_NATIONAL_PARTY_CONVENTION_ACCOUNT,
            ScheduleATransactionTypes.TRIBAL_NATIONAL_PARTY_CONVENTION_ACCOUNT,
            ScheduleATransactionTypes.EARMARK_RECEIPT_FOR_RECOUNT_ACCOUNT_CONTRIBUTION,
            ScheduleATransactionTypes.EARMARK_RECEIPT_FOR_CONVENTION_ACCOUNT_CONTRIBUTION,
            ScheduleATransactionTypes.EARMARK_RECEIPT_FOR_HEADQUARTERS_ACCOUNT_CONTRIBUTION,
            ScheduleATransactionTypes.PARTNERSHIP_NATIONAL_PARTY_RECOUNT_ACCOUNT,
            ScheduleATransactionTypes.PARTNERSHIP_NATIONAL_PARTY_CONVENTION_ACCOUNT,
            ScheduleATransactionTypes.PARTNERSHIP_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT,
          ];
          break;
        case Disbursement.OPERATING_EXPENDITURES:
          transactionTypes = [
            ScheduleBTransactionTypes.OPERATING_EXPENDITURE,
            ScheduleBTransactionTypes.OPERATING_EXPENDITURE_CREDIT_CARD_PAYMENT,
            ScheduleBTransactionTypes.OPERATING_EXPENDITURE_STAFF_REIMBURSEMENT,
            ScheduleBTransactionTypes.OPERATING_EXPENDITURE_PAYMENT_TO_PAYROLL,
            ScheduleBTransactionTypes.OPERATING_EXPENDITURE_VOID,
          ];
          break;
        case Disbursement.CONTRIBUTIONS_EXPENDITURES_TO_REGISTERED_FILERS:
          transactionTypes = [
            ScheduleBTransactionTypes.TRANSFER_TO_AFFILIATES,
            ScheduleBTransactionTypes.CONTRIBUTION_TO_CANDIDATE,
            ScheduleBTransactionTypes.CONTRIBUTION_TO_CANDIDATE_VOID,
            ScheduleBTransactionTypes.CONTRIBUTION_TO_OTHER_COMMITTEE,
            ScheduleBTransactionTypes.CONTRIBUTION_TO_OTHER_COMMITTEE_VOID,
            ScheduleBTransactionTypes.IN_KIND_CONTRIBUTION_TO_CANDIDATE,
            ScheduleBTransactionTypes.IN_KIND_CONTRIBUTION_TO_OTHER_COMMITTEE,
            ScheduleFTransactionTypes.COORDINATED_PARTY_EXPENDITURE,
            ScheduleFTransactionTypes.COORDINATED_PARTY_EXPENDITURE_VOID,
            ScheduleETransactionTypes.INDEPENDENT_EXPENDITURE,
            ScheduleETransactionTypes.INDEPENDENT_EXPENDITURE_VOID,
            ScheduleETransactionTypes.MULTISTATE_INDEPENDENT_EXPENDITURE,
            ScheduleETransactionTypes.INDEPENDENT_EXPENDITURE_CREDIT_CARD_PAYMENT,
            ScheduleETransactionTypes.INDEPENDENT_EXPENDITURE_STAFF_REIMBURSEMENT,
            ScheduleETransactionTypes.INDEPENDENT_EXPENDITURE_PAYMENT_TO_PAYROLL,
          ];
          break;
        case Disbursement.OTHER_EXPENDITURES:
          transactionTypes = [
            ScheduleBTransactionTypes.BUSINESS_LABOR_REFUND_NON_CONTRIBUTION_ACCOUNT,
            ScheduleBTransactionTypes.INDIVIDUAL_REFUND_NON_CONTRIBUTION_ACCOUNT,
            ScheduleBTransactionTypes.INDIVIDUAL_REFUND_NP_HEADQUARTERS_ACCOUNT,
            ScheduleBTransactionTypes.INDIVIDUAL_REFUND_NP_CONVENTION_ACCOUNT,
            ScheduleBTransactionTypes.INDIVIDUAL_REFUND_NP_RECOUNT_ACCOUNT,
            ScheduleBTransactionTypes.OTHER_COMMITTEE_REFUND_NON_CONTRIBUTION_ACCOUNT,
            ScheduleBTransactionTypes.OTHER_DISBURSEMENT,
            ScheduleBTransactionTypes.OTHER_DISBURSEMENT_CREDIT_CARD_PAYMENT,
            ScheduleBTransactionTypes.OTHER_DISBURSEMENT_STAFF_REIMBURSEMENT,
            ScheduleBTransactionTypes.OTHER_DISBURSEMENT_PAYMENT_TO_PAYROLL,
            ScheduleBTransactionTypes.OTHER_DISBURSEMENT_VOID,
            ScheduleBTransactionTypes.NON_CONTRIBUTION_ACCOUNT_DISBURSEMENT,
            ScheduleBTransactionTypes.NON_CONTRIBUTION_ACCOUNT_CREDIT_CARD_PAYMENT,
            ScheduleBTransactionTypes.NON_CONTRIBUTION_ACCOUNT_STAFF_REIMBURSEMENT,
            ScheduleBTransactionTypes.NON_CONTRIBUTION_ACCOUNT_PAYMENT_TO_PAYROLL,
            ScheduleBTransactionTypes.NATIONAL_PARTY_RECOUNT_ACCOUNT_DISBURSEMENT,
            ScheduleBTransactionTypes.RECOUNT_ACCOUNT_DISBURSEMENT,
            ScheduleBTransactionTypes.NATIONAL_PARTY_HEADQUARTERS_ACCOUNT_DISBURSEMENT,
            ScheduleBTransactionTypes.NATIONAL_PARTY_CONVENTION_ACCOUNT_DISBURSEMENT,
            ScheduleBTransactionTypes.TRIBAL_REFUND_NP_HEADQUARTERS_ACCOUNT,
            ScheduleBTransactionTypes.TRIBAL_REFUND_NP_CONVENTION_ACCOUNT,
            ScheduleBTransactionTypes.TRIBAL_REFUND_NP_RECOUNT_ACCOUNT,
            ScheduleBTransactionTypes.OTHER_COMMITTEE_REFUND_REFUND_NP_HEADQUARTERS_ACCOUNT,
            ScheduleBTransactionTypes.OTHER_COMMITTEE_REFUND_REFUND_NP_CONVENTION_ACCOUNT,
            ScheduleBTransactionTypes.OTHER_COMMITTEE_REFUND_REFUND_NP_RECOUNT_ACCOUNT,
          ];
          break;
        case Disbursement.REFUND:
          transactionTypes = [
            ScheduleBTransactionTypes.REFUND_INDIVIDUAL_CONTRIBUTION,
            ScheduleBTransactionTypes.REFUND_INDIVIDUAL_CONTRIBUTION_VOID,
            ScheduleBTransactionTypes.REFUND_PARTY_CONTRIBUTION,
            ScheduleBTransactionTypes.REFUND_PARTY_CONTRIBUTION_VOID,
            ScheduleBTransactionTypes.REFUND_PAC_CONTRIBUTION,
            ScheduleBTransactionTypes.REFUND_PAC_CONTRIBUTION_VOID,
            ScheduleBTransactionTypes.REFUND_UNREGISTERED_CONTRIBUTION,
            ScheduleBTransactionTypes.REFUND_UNREGISTERED_CONTRIBUTION_VOID,
          ];
          break;
        case Disbursement.FEDERAL_ELECTION_ACTIVITY_EXPENDITURES:
          transactionTypes = [
            ScheduleBTransactionTypes.FEDERAL_ELECTION_ACTIVITY_100PCT_PAYMENT,
            ScheduleBTransactionTypes.FEDERAL_ELECTION_ACTIVITY_CREDIT_CARD_PAYMENT,
            ScheduleBTransactionTypes.FEDERAL_ELECTION_ACTIVITY_STAFF_REIMBURSEMENT,
            ScheduleBTransactionTypes.FEDERAL_ELECTION_ACTIVITY_PAYMENT_TO_PAYROLL,
            ScheduleBTransactionTypes.FEDERAL_ELECTION_ACTIVITY_VOID,
          ];
          break;
        case LoansAndDebts.LOANS:
          transactionTypes = [
            ScheduleCTransactionTypes.LOAN_RECEIVED_FROM_INDIVIDUAL,
            ScheduleCTransactionTypes.LOAN_RECEIVED_FROM_BANK,
            ScheduleCTransactionTypes.LOAN_BY_COMMITTEE,
          ];
          break;
        case LoansAndDebts.DEBTS:
          transactionTypes = [
            ScheduleDTransactionTypes.DEBT_OWED_BY_COMMITTEE,
            ScheduleDTransactionTypes.DEBT_OWED_TO_COMMITTEE,
          ];
          break;

        case Disbursement.COORDINATED_EXPENDITURES:
          transactionTypes = [
            ScheduleFTransactionTypes.COORDINATED_PARTY_EXPENDITURE,
            ScheduleFTransactionTypes.COORDINATED_PARTY_EXPENDITURE_VOID,
          ];
          break;
        default:
          break;
      }

      if (!this.committeeAccount().isPAC) transactionTypes = transactionTypes.filter((tt) => !PAC_ONLY().includes(tt));
      if (!this.committeeAccount().isPTY) transactionTypes = transactionTypes.filter((tt) => !PTY_ONLY().includes(tt));

      if (this.debtId()) {
        const debtPaymentLines = [
          ...[
            'SB21A',
            'SB21B',
            'SB22',
            'SB23',
            'SB24',
            'SE',
            'SF',
            'SB25',
            'SB28A',
            'SB28B',
            'SB28C',
            'SB29',
            'H6',
            'SB30B',
          ],
          ...['SA11AI', 'SA11B', 'SA11C', 'SA12', 'SA15', 'SA16', 'SA17', 'H3'],
        ];
        typeMap.set(
          group,
          transactionTypes.filter((transactionType) => {
            if (this.isTransactionDisabled(transactionType)) return false;
            const lineNumber = TransactionTypeUtils.factory(transactionType).getNewTransaction().form_type ?? '';
            return debtPaymentLines.includes(lineNumber);
          }),
        );
      } else {
        typeMap.set(
          group,
          transactionTypes.filter((transactionType) => this.showTransaction(transactionType)),
        );
      }
    });
    return typeMap;
  });

  readonly hasTransactions = computed(() => {
    const groups = this.transactionGroups();
    const hasMap = new Map<TransactionGroupTypes, boolean>();
    groups.forEach((group) => {
      const type = this.transactionTypes().get(group);
      if (!type) hasMap.set(group, false);
      else hasMap.set(group, type.length > 0);
    });
    return hasMap;
  });

  isTransactionDisabled(transactionTypeIdentifier: string): boolean {
    return !getTransactionTypeClass(transactionTypeIdentifier);
  }

  showTransaction(transactionTypeIdentifier: string): boolean {
    // currently we only hide SchedF in some ɵnvironments, but in the future?
    return !(!environment.showSchedF && transactionTypeIdentifier in ScheduleFTransactionTypes);
  }

  getRouterLink(transactionType: string): string | undefined {
    if (this.report && !this.isTransactionDisabled(transactionType)) {
      return `/reports/transactions/report/${this.report().id}/create/${transactionType}`;
    }
    return undefined;
  }
}
