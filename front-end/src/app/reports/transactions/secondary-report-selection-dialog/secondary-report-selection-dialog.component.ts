import { Component, computed, inject, input, model, output, Signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Report, ReportStatus, ReportTypes, reportLabelList } from 'app/shared/models/report.model';
import { Transaction } from 'app/shared/models/transaction.model';
import { LabelPipe } from 'app/shared/pipes/label.pipe';
import { Form24Service } from 'app/shared/services/form-24.service';
import { Form3XService } from 'app/shared/services/form-3x.service';
import { Form24, Form3X } from 'app/shared/models';
import { TransactionService } from 'app/shared/services/transaction.service';
import { LabelList } from 'app/shared/utils/label.utils';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { Ripple } from 'primeng/ripple';
import { Select, SelectModule } from 'primeng/select';
import { Toast } from 'primeng/toast';
import { derivedAsync } from 'ngxtension/derived-async';

@Component({
  selector: 'app-secondary-report-selection-dialog',
  templateUrl: './secondary-report-selection-dialog.component.html',
  styleUrls: ['./secondary-report-selection-dialog.component.scss'],
  imports: [ButtonModule, Ripple, Toast, LabelPipe, SelectModule, DialogModule, FormsModule],
})
export class SecondaryReportSelectionDialogComponent {
  public readonly router = inject(Router);
  private readonly f24Service = inject(Form24Service);
  private readonly f3xService = inject(Form3XService);
  readonly reportService = computed(() => (this.isForm24() ? this.f24Service : this.f3xService));
  private readonly transactionService = inject(TransactionService);
  private readonly messageService = inject(MessageService);

  readonly reportTypeLabels = reportLabelList;

  readonly select = viewChild.required(Select);

  readonly transaction = input<Transaction>();
  readonly dialogVisible = model.required<boolean>();

  readonly selectedReport = model<Form3X | Form24 | undefined>();
  readonly reloadTables = output<void>();
  readonly create = output<void>();
  readonly dropDownFieldText = computed(() => {
    const report = this.selectedReport();
    if (!report) return 'Loading Reports...';
    return new LabelPipe().transform(report.id, this.reportLabels());
  });

  readonly reportType = input.required<ReportTypes | undefined>();

  readonly reports = derivedAsync(
    async () => {
      const type = this.reportType();
      if (!type) return [];
      const reports = await this.reportService().getAllReports();
      return reports.filter((report) => {
        return report.report_status === ReportStatus.IN_PROGRESS;
      });
    },
    { initialValue: [] },
  );

  readonly isForm24 = computed(() => this.reportType() === ReportTypes.F24);

  readonly reportLabels: Signal<LabelList> = computed(() =>
    this.reports().map((report) => [report.id as string, report.formSubLabel]),
  );
  readonly placeholder = computed(() => {
    if (!this.reportType()) return 'Loading report type';
    return this.reports().length === 0
      ? `No In-Progress ${this.reportType()} Reports are available`
      : `Select a ${this.reportType()} Report`;
  });

  public async linkToSelectedReport() {
    const transaction = this.transaction();
    const report = this.selectedReport();
    if (!report || !transaction) return;
    const response = await this.transactionService.addToReport(transaction, report);
    this.create.emit();
    if (response.status === 200) {
      this.dialogVisible.set(false);
      this.reloadTables.emit();
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: `Transaction added to ${this.reportType()} Report`,
        key: 'reportLinkToast',
        life: 3000,
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: `Transaction was not added to ${this.reportType()} Report`,
        key: 'reportLinkToast',
        life: 3000,
      });
    }
  }

  showDialog() {
    this.select().applyFocus();
  }
}
