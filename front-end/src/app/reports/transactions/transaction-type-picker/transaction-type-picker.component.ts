import { Component, computed, effect, inject, model, Signal, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { CommitteeStore } from 'app/committee/committee.store';
import { DestroyerComponent } from 'app/shared/components/destroyer.component';
import { ReportTypes } from 'app/shared/models/reports/report.model';
import { ScheduleATransactionTypeLabels } from 'app/shared/models/scha-transaction.model';
import { ScheduleBTransactionTypeLabels } from 'app/shared/models/schb-transaction.model';
import { ScheduleCTransactionTypeLabels } from 'app/shared/models/schc-transaction.model';
import { ScheduleDTransactionTypeLabels } from 'app/shared/models/schd-transaction.model';
import { ScheduleETransactionTypeLabels } from 'app/shared/models/sche-transaction.model';
import { ScheduleFTransactionTypeLabels, ScheduleFTransactionTypes } from 'app/shared/models/schf-transaction.model';
import { Categories, CategoryPicker } from 'app/shared/models/transaction-group';
import { TransactionGroupTypes, TransactionTypes } from 'app/shared/models/transaction.model';
import { scrollToTop } from 'app/shared/utils/form.utils';
import { LabelList } from 'app/shared/utils/label.utils';
import { isTransactionTypeDisabledForReport } from 'app/shared/utils/transaction-disable.utils';
import {
  getTransactionTypeClass,
  PAC_ONLY,
  PTY_ONLY,
  TransactionTypeUtils,
} from 'app/shared/utils/transaction-type.utils';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { Accordion, AccordionModule } from 'primeng/accordion';
import { environment } from '../../../../environments/environment';
import { LabelPipe } from '../../../shared/pipes/label.pipe';

@Component({
  selector: 'app-transaction-type-picker',
  templateUrl: './transaction-type-picker.component.html',
  styleUrls: ['./transaction-type-picker.component.scss'],
  imports: [RouterLink, LabelPipe, AccordionModule],
})
export class TransactionTypePickerComponent extends DestroyerComponent {
  private readonly committeeStore = inject(CommitteeStore);
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

  readonly active = model<number>(-1);
  readonly isF3 = computed(() => this.report().report_type === ReportTypes.F3);

  readonly transactionGroups: Signal<Array<{ label: string; transactionTypes: Set<TransactionTypes> }>> = computed(
    () => CategoryPicker.get(this.category()) ?? [],
  );

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
    const report = this.report();
    groups.forEach((group) => {
      const transactionTypes = report.transactionTypes.filter(
        (t) =>
          group.transactionTypes.has(t) &&
          (this.isF3() ||
            ((this.committeeStore.isPAC() || !PAC_ONLY().has(t)) &&
              (this.committeeStore.isPTY() || !PTY_ONLY().has(t)))),
      );

      if (this.debtId()) {
        typeMap.set(
          group,
          transactionTypes.filter((transactionType) => {
            if (this.isTransactionDisabled(transactionType)) return false;
            return debtPaymentTypes.has(transactionType);
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
    return (
      isTransactionTypeDisabledForReport(this.report().report_type, transactionTypeIdentifier) ||
      !getTransactionTypeClass(transactionTypeIdentifier)
    );
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

const debtPaymentTypes = new Set([
  // SB21B
  'IN_KIND_OUT',
  'IN_KIND_TRANSFER_OUT',
  'INDIVIDUAL_REFUND_NP_CONVENTION_ACCOUNT',
  'INDIVIDUAL_REFUND_NP_HEADQUARTERS_ACCOUNT',
  'NATIONAL_PARTY_CONVENTION_ACCOUNT_DISBURSEMENT',
  'NATIONAL_PARTY_HEADQUARTERS_ACCOUNT_DISBURSEMENT',
  'OPERATING_EXPENDITURE_CREDIT_CARD_PAYMENT_MEMO',
  'OPERATING_EXPENDITURE_CREDIT_CARD_PAYMENT',
  'OPERATING_EXPENDITURE_PAYMENT_TO_PAYROLL_MEMO',
  'OPERATING_EXPENDITURE_PAYMENT_TO_PAYROLL',
  'OPERATING_EXPENDITURE_STAFF_REIMBURSEMENT_MEMO',
  'OPERATING_EXPENDITURE_STAFF_REIMBURSEMENT',
  'OPERATING_EXPENDITURE_VOID',
  'OPERATING_EXPENDITURE',
  'OTHER_COMMITTEE_REFUND_REFUND_NP_CONVENTION_ACCOUNT',
  'OTHER_COMMITTEE_REFUND_REFUND_NP_HEADQUARTERS_ACCOUNT',
  'PAC_IN_KIND_OUT',
  'PARTY_IN_KIND_OUT',
  'TRIBAL_REFUND_NP_CONVENTION_ACCOUNT',
  'TRIBAL_REFUND_NP_HEADQUARTERS_ACCOUNT',
  // SB22
  'TRANSFER_TO_AFFILIATES',
  // SB23
  'CONDUIT_EARMARK_OUT_UNDEPOSITED',
  'CONDUIT_EARMARK_OUT_DEPOSITED',
  'CONTRIBUTION_TO_CANDIDATE_VOID',
  'CONTRIBUTION_TO_CANDIDATE',
  'CONTRIBUTION_TO_OTHER_COMMITTEE_VOID',
  'CONTRIBUTION_TO_OTHER_COMMITTEE',
  'IN_KIND_CONTRIBUTION_TO_CANDIDATE',
  'IN_KIND_CONTRIBUTION_TO_OTHER_COMMITTEE',
  'PAC_CONDUIT_EARMARK_OUT_UNDEPOSITED',
  'PAC_CONDUIT_EARMARK_OUT_DEPOSITED',
  'INDEPENDENT_EXPENDITURE_CREDIT_CARD_PAYMENT_MEMO',
  'INDEPENDENT_EXPENDITURE_CREDIT_CARD_PAYMENT',
  'INDEPENDENT_EXPENDITURE_PAYMENT_TO_PAYROLL_MEMO',
  'INDEPENDENT_EXPENDITURE_PAYMENT_TO_PAYROLL',
  'INDEPENDENT_EXPENDITURE_STAFF_REIMBURSEMENT_MEMO',
  'INDEPENDENT_EXPENDITURE_STAFF_REIMBURSEMENT',
  'INDEPENDENT_EXPENDITURE_VOID',
  'INDEPENDENT_EXPENDITURE',
  'MULTISTATE_INDEPENDENT_EXPENDITURE',
  'COORDINATED_PARTY_EXPENDITURE_VOID',
  'COORDINATED_PARTY_EXPENDITURE',
  // SB28A
  'REFUND_INDIVIDUAL_CONTRIBUTION_VOID',
  'REFUND_INDIVIDUAL_CONTRIBUTION',
  'REFUND_RECEIPT_FROM_UNREGISTERED_ORGANIZATION_VOID',
  'REFUND_RECEIPT_FROM_UNREGISTERED_ORGANIZATION',
  // SB28B
  'REFUND_PARTY_CONTRIBUTION_VOID',
  'REFUND_PARTY_CONTRIBUTION',
  // SB28C
  'REFUND_PAC_CONTRIBUTION_VOID',
  'REFUND_PAC_CONTRIBUTION',
  // SB29
  'BUSINESS_LABOR_REFUND_NON_CONTRIBUTION_ACCOUNT',
  'INDIVIDUAL_REFUND_NON_CONTRIBUTION_ACCOUNT',
  'INDIVIDUAL_REFUND_NP_RECOUNT_ACCOUNT',
  'NATIONAL_PARTY_RECOUNT_ACCOUNT_DISBURSEMENT',
  'NON_CONTRIBUTION_ACCOUNT_CREDIT_CARD_PAYMENT_MEMO',
  'NON_CONTRIBUTION_ACCOUNT_CREDIT_CARD_PAYMENT',
  'NON_CONTRIBUTION_ACCOUNT_DISBURSEMENT',
  'NON_CONTRIBUTION_ACCOUNT_PAYMENT_TO_PAYROLL_MEMO',
  'NON_CONTRIBUTION_ACCOUNT_PAYMENT_TO_PAYROLL',
  'NON_CONTRIBUTION_ACCOUNT_STAFF_REIMBURSEMENT_MEMO',
  'NON_CONTRIBUTION_ACCOUNT_STAFF_REIMBURSEMENT',
  'OTHER_COMMITTEE_REFUND_NON_CONTRIBUTION_ACCOUNT',
  'OTHER_COMMITTEE_REFUND_REFUND_NP_RECOUNT_ACCOUNT',
  'OTHER_DISBURSEMENT_CREDIT_CARD_PAYMENT_MEMO',
  'OTHER_DISBURSEMENT_CREDIT_CARD_PAYMENT',
  'OTHER_DISBURSEMENT_PAYMENT_TO_PAYROLL_MEMO',
  'OTHER_DISBURSEMENT_PAYMENT_TO_PAYROLL',
  'OTHER_DISBURSEMENT_STAFF_REIMBURSEMENT_MEMO',
  'OTHER_DISBURSEMENT_STAFF_REIMBURSEMENT',
  'OTHER_DISBURSEMENT_VOID',
  'OTHER_DISBURSEMENT',
  'RECOUNT_ACCOUNT_DISBURSEMENT',
  'TRIBAL_REFUND_NP_RECOUNT_ACCOUNT',
  // SB30B
  'FEDERAL_ELECTION_ACTIVITY_100PCT_PAYMENT',
  'FEDERAL_ELECTION_ACTIVITY_CREDIT_CARD_PAYMENT_MEMO',
  'FEDERAL_ELECTION_ACTIVITY_CREDIT_CARD_PAYMENT',
  'FEDERAL_ELECTION_ACTIVITY_PAYMENT_TO_PAYROLL_MEMO',
  'FEDERAL_ELECTION_ACTIVITY_PAYMENT_TO_PAYROLL',
  'FEDERAL_ELECTION_ACTIVITY_STAFF_REIMBURSEMENT_MEMO',
  'FEDERAL_ELECTION_ACTIVITY_STAFF_REIMBURSEMENT',
  'FEDERAL_ELECTION_ACTIVITY_VOID',
  'IN_KIND_TRANSFER_FEA_OUT',
  // SA11AI
  'CONDUIT_EARMARK_RECEIPT_UNDEPOSITED',
  'CONDUIT_EARMARK_RECEIPT_DEPOSITED',
  'EARMARK_MEMO',
  'EARMARK_RECEIPT',
  'IN_KIND_RECEIPT',
  'INDIVIDUAL_RECEIPT',
  'PARTNERSHIP_ATTRIBUTION',
  'PARTNERSHIP_RECEIPT',
  'RECEIPT_FROM_UNREGISTERED_ORGANIZATION_RETURN',
  'RECEIPT_FROM_UNREGISTERED_ORGANIZATION',
  'RETURN_RECEIPT',
  'TRIBAL_RECEIPT',
  // SA11B
  'PARTY_IN_KIND_RECEIPT',
  'PARTY_RECEIPT',
  'PARTY_RETURN',
  // SA11C
  'PAC_CONDUIT_EARMARK_RECEIPT_UNDEPOSITED',
  'PAC_CONDUIT_EARMARK_RECEIPT_DEPOSITED',
  'PAC_EARMARK_MEMO',
  'PAC_EARMARK_RECEIPT',
  'PAC_IN_KIND_RECEIPT',
  'PAC_RECEIPT',
  'PAC_RETURN',
  // SA12
  'IN_KIND_TRANSFER_FEDERAL_ELECTION_ACTIVITY',
  'IN_KIND_TRANSFER',
  'INDIVIDUAL_JF_TRANSFER_MEMO',
  'JOINT_FUNDRAISING_TRANSFER',
  'PAC_JF_TRANSFER_MEMO',
  'PARTNERSHIP_ATTRIBUTION_JF_TRANSFER_MEMO',
  'PARTNERSHIP_JF_TRANSFER_MEMO',
  'PARTY_JF_TRANSFER_MEMO',
  'TRANSFER',
  'TRIBAL_JF_TRANSFER_MEMO',
  // SA15
  'OFFSET_TO_OPERATING_EXPENDITURES',
  // SA16
  'REFUND_TO_FEDERAL_CANDIDATE',
  'REFUND_TO_OTHER_POLITICAL_COMMITTEE',
  'REFUND_TO_UNREGISTERED_COMMITTEE',
  // SA17
  'BUSINESS_LABOR_NON_CONTRIBUTION_ACCOUNT',
  'EARMARK_MEMO_CONVENTION_ACCOUNT',
  'EARMARK_MEMO_HEADQUARTERS_ACCOUNT',
  'EARMARK_MEMO_RECOUNT_ACCOUNT',
  'EARMARK_RECEIPT_CONVENTION_ACCOUNT',
  'EARMARK_RECEIPT_HEADQUARTERS_ACCOUNT',
  'EARMARK_RECEIPT_RECOUNT_ACCOUNT',
  'INDIVIDUAL_NATIONAL_PARTY_CONVENTION_ACCOUNT',
  'INDIVIDUAL_NATIONAL_PARTY_CONVENTION_JF_TRANSFER_MEMO',
  'INDIVIDUAL_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT',
  'INDIVIDUAL_NATIONAL_PARTY_HEADQUARTERS_JF_TRANSFER_MEMO',
  'INDIVIDUAL_NATIONAL_PARTY_RECOUNT_ACCOUNT',
  'INDIVIDUAL_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO',
  'INDIVIDUAL_RECEIPT_NON_CONTRIBUTION_ACCOUNT',
  'INDIVIDUAL_RECOUNT_RECEIPT',
  'JF_TRANSFER_NATIONAL_PARTY_CONVENTION_ACCOUNT',
  'JF_TRANSFER_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT',
  'JF_TRANSFER_NATIONAL_PARTY_RECOUNT_ACCOUNT',
  'OTHER_COMMITTEE_NON_CONTRIBUTION_ACCOUNT',
  'OTHER_RECEIPT',
  'PAC_NATIONAL_PARTY_CONVENTION_ACCOUNT',
  'PAC_NATIONAL_PARTY_CONVENTION_JF_TRANSFER_MEMO',
  'PAC_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT',
  'PAC_NATIONAL_PARTY_HEADQUARTERS_JF_TRANSFER_MEMO',
  'PAC_NATIONAL_PARTY_RECOUNT_ACCOUNT',
  'PAC_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO',
  'PAC_RECOUNT_RECEIPT',
  'PARTNERSHIP_ATTRIBUTION_NATIONAL_PARTY_CONVENTION_ACCOUNT_MEMO',
  'PARTNERSHIP_ATTRIBUTION_NATIONAL_PARTY_CONVENTION_JF_TRANSFER_MEMO',
  'PARTNERSHIP_ATTRIBUTION_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT_MEMO',
  'PARTNERSHIP_ATTRIBUTION_NATIONAL_PARTY_HEADQUARTERS_JF_TRANSFER_MEMO',
  'PARTNERSHIP_ATTRIBUTION_NATIONAL_PARTY_RECOUNT_ACCOUNT_MEMO',
  'PARTNERSHIP_ATTRIBUTION_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO',
  'PARTNERSHIP_ATTRIBUTION_RECOUNT_ACCOUNT_RECEIPT_MEMO',
  'PARTNERSHIP_NATIONAL_PARTY_CONVENTION_ACCOUNT',
  'PARTNERSHIP_NATIONAL_PARTY_CONVENTION_JF_TRANSFER_MEMO',
  'PARTNERSHIP_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT',
  'PARTNERSHIP_NATIONAL_PARTY_HEADQUARTERS_JF_TRANSFER_MEMO',
  'PARTNERSHIP_NATIONAL_PARTY_RECOUNT_ACCOUNT',
  'PARTNERSHIP_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO',
  'PARTNERSHIP_RECOUNT_ACCOUNT_RECEIPT',
  'PARTY_NATIONAL_PARTY_CONVENTION_ACCOUNT',
  'PARTY_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT',
  'PARTY_NATIONAL_PARTY_RECOUNT_ACCOUNT',
  'PARTY_RECOUNT_RECEIPT',
  'TRIBAL_NATIONAL_PARTY_CONVENTION_ACCOUNT',
  'TRIBAL_NATIONAL_PARTY_CONVENTION_JF_TRANSFER_MEMO',
  'TRIBAL_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT',
  'TRIBAL_NATIONAL_PARTY_HEADQUARTERS_JF_TRANSFER_MEMO',
  'TRIBAL_NATIONAL_PARTY_RECOUNT_ACCOUNT',
  'TRIBAL_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO',
  'TRIBAL_RECOUNT_RECEIPT',
]);
