import { Component, computed, effect, ElementRef, inject, viewChild } from '@angular/core';
import { Report } from '../../../../shared/models/reports/report.model';
import { ReattRedesUtils } from '../../../../shared/utils/reatt-redes/reatt-redes.utils';
import { Router } from '@angular/router';
import { Form3XService } from '../../../../shared/services/form-3x.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { Store } from '@ngrx/store';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { DateUtils } from 'app/shared/utils/date.utils';
import { toSignal } from '@angular/core/rxjs-interop';
import { derivedAsync } from 'ngxtension/derived-async';
import type { Form3X } from 'app/shared/models/reports/form-3x.model';

@Component({
  selector: 'app-select-report-dialog',
  templateUrl: './select-report-dialog.component.html',
  styleUrls: ['./select-report-dialog.component.scss'],
  imports: [ReactiveFormsModule, FormsModule, ButtonDirective, Ripple],
})
export class SelectReportDialogComponent {
  public readonly router = inject(Router);
  private readonly service = inject(Form3XService);
  readonly store = inject(Store);
  readonly selectReportDialog = viewChild.required<ElementRef<HTMLDialogElement>>('selectReportDialog');
  readonly report = this.store.selectSignal(selectActiveReport);

  readonly selectReportDialogSubject = toSignal(ReattRedesUtils.selectReportDialogSubject);
  readonly transaction = computed(() =>
    this.selectReportDialogSubject() ? this.selectReportDialogSubject()![0] : undefined,
  );
  readonly type = computed(() => (this.selectReportDialogSubject() ? this.selectReportDialogSubject()![1] : undefined));
  readonly visible = computed(() => !!this.transaction());

  readonly availableReports = derivedAsync(
    () => {
      const visible = this.visible();
      if (!visible) return [];
      const coverageThroughDate = DateUtils.convertDateToFecFormat((this.report() as Form3X).coverage_through_date!);
      if (!coverageThroughDate) {
        console.error('No coverage through date found for transaction');
        return [];
      }
      return this.service.getFutureReports(coverageThroughDate);
    },
    { initialValue: [] },
  );

  readonly actionLabel = computed(() => (ReattRedesUtils.isReattribute(this.type()) ? 'reattribute' : 'redesignate'));
  readonly urlParameter = computed(() =>
    ReattRedesUtils.isReattribute(this.type()) ? 'reattribution' : 'redesignation',
  );
  readonly actionTargetLabel = computed(() =>
    ReattRedesUtils.isReattribute(this.type()) ? 'contributor' : 'election',
  );

  selectedReport?: Report;

  constructor() {
    effect(() => {
      if (this.visible()) {
        this.selectReportDialog().nativeElement.show();
        this.selectedReport = undefined;
      } else {
        this.selectReportDialog().nativeElement.close();
      }
    });
  }

  async createReattribution() {
    const transaction = this.transaction();
    if (!transaction) throw new Error('No base transaction');
    await this.router.navigateByUrl(
      `/reports/transactions/report/${this.selectedReport?.id}/create/${transaction.transaction_type_identifier}?${this.urlParameter()}=${transaction.id}`,
    );
    ReattRedesUtils.selectReportDialogSubject.next(undefined);
  }

  cancel() {
    ReattRedesUtils.selectReportDialogSubject.next(undefined);
  }
}
