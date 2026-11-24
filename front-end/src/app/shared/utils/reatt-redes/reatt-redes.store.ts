import { computed, inject, Injectable, signal } from '@angular/core';
import { ReattRedesTypes, ReattRedesUtils } from './reatt-redes.utils';
import { Store } from '@ngrx/store';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { DateUtils } from '../date.utils';
import { Form3XService } from 'app/shared/services/form-3x.service';
import { Form3Service } from 'app/shared/services/form-3.service';
import type { TransactionListRecord } from 'app/shared/models/transaction-list-record.model';
import type { Form3X } from 'app/shared/models/reports/form-3x.model';
import { Form3 } from 'app/shared/models/reports/form-3.model';
import { ReportTypes } from 'app/shared/models';

interface ReatRedesTransaction {
  transaction: TransactionListRecord;
  type: ReattRedesTypes;
}

@Injectable()
export class ReattRedesStore {
  private readonly store = inject(Store);
  private readonly form3xService = inject(Form3XService);
  private readonly form3Service = inject(Form3Service);
  private readonly activeReport = this.store.selectSignal(selectActiveReport);
  private readonly _futureReports = signal<Form3X[] | Form3[] | null>(null);
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
    let reportService: Form3Service | Form3XService | undefined;
    const activeReport = this.activeReport() as Form3 | Form3X;
    if (activeReport.report_type === ReportTypes.F3) {
      reportService = this.form3Service;
    } else if (activeReport.report_type === ReportTypes.F3X) {
      reportService = this.form3xService;
    }

    if (reportService) {
      const coverageThroughDate = DateUtils.convertDateToFecFormat(activeReport.coverage_through_date!);
      const futureReports = await reportService.getFutureReports(coverageThroughDate);
      this._reatRedesTransaction.set({ transaction, type });
      this._futureReports.set(futureReports);
    }
  }

  clearTransaction() {
    this._reatRedesTransaction.set(null);
    this._futureReports.set(null);
  }
}
