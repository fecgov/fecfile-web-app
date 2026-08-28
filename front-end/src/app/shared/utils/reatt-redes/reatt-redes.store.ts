import { computed, inject, Injectable, signal } from '@angular/core';
import { ReattRedesTypes, ReattRedesUtils } from './reatt-redes.utils';
import { Store } from '@ngrx/store';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { DateUtils } from '../date.utils';
import { Form3XService } from 'app/shared/services/form-3x.service';
import type { TransactionListRecord } from 'app/shared/models/transaction-list-record.model';
import type { Form3X } from 'app/shared/models/reports/form-3x.model';

interface ReatRedesTransaction {
  transaction: TransactionListRecord;
  type: ReattRedesTypes;
}

@Injectable()
export class ReattRedesStore {
  private readonly store = inject(Store);
  private readonly reportService = inject(Form3XService);
  private readonly activeReport = this.store.selectSignal(selectActiveReport);
  private readonly _futureReports = signal<Form3X[] | null>(null);
  readonly futureReports = this._futureReports.asReadonly();

  private readonly _reatRedesTransaction = signal<ReatRedesTransaction | null>(null);
  readonly transaction = computed(() => this._reatRedesTransaction()?.transaction ?? null);
  readonly type = computed(() => this._reatRedesTransaction()?.type ?? null);

  readonly actionLabel = computed(() => {
    const type = this.type();
    if (type === null) return '';
    return ReattRedesUtils.isReattribute(type) ? 'reattribute' : 'redesignate';
  });
  readonly nounLabel = computed(() => {
    const type = this.type();
    if (type === null) return '';
    return ReattRedesUtils.isReattribute(type) ? 'reattribution' : 'redesignation';
  });
  readonly actionTargetLabel = computed(() => {
    const type = this.type();
    if (type === null) return '';
    return ReattRedesUtils.isReattribute(type) ? 'contributor' : 'election';
  });

  async setTransaction(transaction: TransactionListRecord, type: ReattRedesTypes) {
    const coverageThroughDate = DateUtils.convertDateToFecFormat(
      (this.activeReport() as Form3X).coverage_through_date!,
    );
    const futureReports = await this.reportService.getFutureReports(coverageThroughDate);
    this._reatRedesTransaction.set({ transaction, type });
    this._futureReports.set(futureReports);
  }

  clearTransaction() {
    this._reatRedesTransaction.set(null);
    this._futureReports.set(null);
  }
}
