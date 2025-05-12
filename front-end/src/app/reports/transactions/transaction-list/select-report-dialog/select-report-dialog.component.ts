import { Component, computed, effect, ElementRef, inject, model, viewChild } from '@angular/core';
import { Report } from '../../../../shared/models/report.model';
import { ReattRedesUtils } from '../../../../shared/utils/reatt-redes/reatt-redes.utils';
import { Router } from '@angular/router';
import { Form3XService } from '../../../../shared/services/form-3x.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { derivedAsync } from 'ngxtension/derived-async';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-select-report-dialog',
  templateUrl: './select-report-dialog.component.html',
  styleUrls: ['./select-report-dialog.component.scss'],
  imports: [ReactiveFormsModule, FormsModule, ButtonDirective, Ripple, SelectModule],
})
export class SelectReportDialogComponent {
  public readonly router = inject(Router);
  private readonly service = inject(Form3XService);

  readonly availableReports = derivedAsync(
    async () => {
      const date = this.coverage_through_date();
      if (!date) return [];
      return await this.service.getFutureReports(date.toString());
    },
    { initialValue: [] },
  );

  readonly transaction = computed(() => ReattRedesUtils.selectReportDialog()?.[0]);
  readonly type = computed(() => ReattRedesUtils.selectReportDialog()?.[1]);
  readonly coverage_through_date = computed(() => this.transaction()?.getForm3X()?.coverage_through_date);
  private readonly selectReportDialog = viewChild.required<ElementRef<HTMLDialogElement>>('selectReportDialog');

  readonly selectedReport = model<Report>();

  readonly actionLabel = computed(() => (ReattRedesUtils.isReattribute(this.type()) ? 'reattribute' : 'redesignate'));
  readonly urlParameter = computed(() =>
    ReattRedesUtils.isReattribute(this.type()) ? 'reattribution' : 'redesignation',
  );
  readonly actionTargetLabel = computed(() =>
    ReattRedesUtils.isReattribute(this.type()) ? 'contributor' : 'election',
  );

  constructor() {
    effect(() => {
      if (ReattRedesUtils.selectReportDialog()) this.selectReportDialog().nativeElement.show();
      else this.selectReportDialog().nativeElement.close();
    });
  }

  createReattribution() {
    const transaction = this.transaction();
    if (!transaction) throw new Error('No base transaction');
    const report = this.selectedReport();
    if (!report) throw new Error('No Selected report');
    return this.router.navigateByUrl(
      `/reports/transactions/report/${report.id}/create/${transaction.transaction_type_identifier}?${this.urlParameter()}=${transaction.id}`,
    );
  }

  cancel() {
    ReattRedesUtils.selectReportDialog.set(undefined);
  }
}
