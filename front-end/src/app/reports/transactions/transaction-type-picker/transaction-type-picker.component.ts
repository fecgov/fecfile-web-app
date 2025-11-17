import { Component, computed, effect, inject, model, Signal, viewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { ReportTypes } from 'app/shared/models/reports/report.model';
import { TransactionTypes, TransactionGroupTypes } from 'app/shared/models/transaction.model';
import { ScheduleATransactionTypeLabels } from 'app/shared/models/scha-transaction.model';
import { ScheduleBTransactionTypeLabels } from 'app/shared/models/schb-transaction.model';
import { LabelList } from 'app/shared/utils/label.utils';
import {
  PAC_ONLY,
  PTY_ONLY,
  TransactionTypeUtils,
  getTransactionTypeClass,
} from 'app/shared/utils/transaction-type.utils';
import { DestroyerComponent } from 'app/shared/components/destroyer.component';
import { ScheduleCTransactionTypeLabels } from 'app/shared/models/schc-transaction.model';
import { ScheduleDTransactionTypeLabels } from 'app/shared/models/schd-transaction.model';
import { ScheduleETransactionTypeLabels } from 'app/shared/models/sche-transaction.model';
import { ScheduleFTransactionTypeLabels, ScheduleFTransactionTypes } from 'app/shared/models/schf-transaction.model';
import { selectCommitteeAccount } from 'app/store/committee-account.selectors';
import { Accordion, AccordionModule } from 'primeng/accordion';
import { LabelPipe } from '../../../shared/pipes/label.pipe';
import { environment } from '../../../../environments/environment';
import { toSignal } from '@angular/core/rxjs-interop';
import { Categories, CategoryPicker } from 'app/shared/models/transaction-group';
import { scrollToTop } from 'app/shared/utils/form.utils';

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

  readonly transactionGroups = computed(() => CategoryPicker.get(this.category()) ?? []);

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
          (this.committeeAccount().isPAC || !PAC_ONLY().has(t)) &&
          (this.committeeAccount().isPTY || !PTY_ONLY().has(t)),
      );

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
