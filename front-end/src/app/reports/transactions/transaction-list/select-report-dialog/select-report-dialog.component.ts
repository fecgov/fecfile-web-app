import { Component, computed, effect, inject, signal } from '@angular/core';
import { Report } from '../../../../shared/models/reports/report.model';
import { ReattRedesUtils } from '../../../../shared/utils/reatt-redes/reatt-redes.utils';
import { Router } from '@angular/router';
import { Form3XService } from '../../../../shared/services/form-3x.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { Form3X } from 'app/shared/models';
import { DateUtils } from 'app/shared/utils/date.utils';
import { toSignal } from '@angular/core/rxjs-interop';
import { DialogComponent } from 'app/shared/components/dialog/dialog.component';
import { effectOnceIf } from 'ngxtension/effect-once-if';

@Component({
  selector: 'app-select-report-dialog',
  templateUrl: './select-report-dialog.component.html',
  styleUrls: ['./select-report-dialog.component.scss'],
  imports: [ReactiveFormsModule, FormsModule, DialogComponent],
})
export class SelectReportDialogComponent {
  public readonly router = inject(Router);
  private readonly service = inject(Form3XService);
  readonly store = inject(Store);
  readonly report = this.store.selectSignal(selectActiveReport);

  readonly selectReportDialogSignal = toSignal(ReattRedesUtils.selectReportDialogSubject, { initialValue: undefined });
  readonly transaction = computed(() => this.selectReportDialogSignal()?.[0]);
  readonly type = computed(() => this.selectReportDialogSignal()?.[1]);
  readonly visible = computed(() => !!this.transaction());

  readonly availableReports = signal<Report[] | null>(null);
  readonly hasAvailableReports = computed(() => {
    const reports = this.availableReports();
    return reports && reports.length > 0;
  });

  readonly actionLabel = computed(() => (ReattRedesUtils.isReattribute(this.type()) ? 'reattribute' : 'redesignate'));
  readonly urlParameter = computed(() =>
    ReattRedesUtils.isReattribute(this.type()) ? 'reattribution' : 'redesignation',
  );
  readonly actionTargetLabel = computed(() =>
    ReattRedesUtils.isReattribute(this.type()) ? 'contributor' : 'election',
  );

  selectedReport?: Report;

  constructor() {
    effectOnceIf(
      () => (this.visible() ? this.report() : undefined),
      (report) => {
        const coverageThroughDate = DateUtils.convertDateToFecFormat((report as Form3X).coverage_through_date!);
        this.service.getFutureReports(coverageThroughDate).then((reports) => this.availableReports.set(reports));
      },
    );
    effect(() => {
      const data = this.selectReportDialogSignal();
      if (data && this.availableReports()) {
        this.selectedReport = undefined;
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
