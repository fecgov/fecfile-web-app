import { Component, computed, inject, input, model, output, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Report, ReportStatus, ReportTypes, reportLabelList } from 'app/shared/models/report.model';
import { Transaction } from 'app/shared/models/transaction.model';
import { LabelPipe } from 'app/shared/pipes/label.pipe';
import { ReportService } from 'app/shared/services/report.service';
import { TransactionService } from 'app/shared/services/transaction.service';
import { LabelList } from 'app/shared/utils/label.utils';
import { derivedAsync } from 'ngxtension/derived-async';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { Ripple } from 'primeng/ripple';
import { Select, SelectModule } from 'primeng/select';
import { Toast } from 'primeng/toast';

@Component({
  selector: 'app-secondary-report-selection-dialog',
  templateUrl: './secondary-report-selection-dialog.component.html',
  styleUrls: ['./secondary-report-selection-dialog.component.scss'],
  imports: [ButtonModule, Ripple, Toast, LabelPipe, SelectModule, DialogModule, FormsModule],
})
export class SecondaryReportSelectionDialogComponent {
  public readonly router = inject(Router);
  readonly reportService = inject(ReportService);
  private readonly transactionService = inject(TransactionService);
  private readonly messageService = inject(MessageService);
  readonly reportTypeLabels = reportLabelList;
  readonly reportTypes = ReportTypes;

  private readonly select = viewChild.required<Select>('select');

  readonly transaction = input<Transaction>();
  readonly dialogVisible = input(false);
  readonly createEventMethod = input(() => {
    return;
  });

  readonly dialogClose = output<undefined>();

  readonly reportType = input<ReportTypes | undefined>();
  readonly reports = derivedAsync(
    async () => {
      const reports = await this.reportService.getAllReports();
      return reports.filter((report) => {
        return report.report_type === this.reportType() && report.report_status === ReportStatus.IN_PROGRESS;
      });
    },
    { initialValue: [] },
  );

  readonly reportLabels = computed(() => this.getReportLabels(this.reports()));
  readonly placeholder = computed(() => {
    if (!this.reportType()) return 'Loading report type';
    return this.reports().length === 0
      ? `No In-Progress ${this.reportType()} Reports are available`
      : `Select a ${this.reportType()} Report`;
  });

  readonly selectedReport = model<Report | undefined>();
  readonly dropDownFieldText = computed(() => {
    const report = this.selectedReport();
    if (!report) return 'Loading Reports...';
    return new LabelPipe().transform(report.id, this.reportLabels());
  });

  private getReportLabels(reports: Report[]): LabelList {
    const sortedReports = reports.toSorted(sortReport);
    const labels: LabelList = [];
    let year = 0;
    let inYearCount = 0;
    for (const report of sortedReports) {
      const newYear = report.created?.getFullYear();
      if (newYear && newYear !== year) {
        year = newYear;
        inYearCount = 1;
      } else {
        inYearCount++;
      }

      let label = `${report.getLongLabel()} [${year}] #${inYearCount}`;
      if (report.form_type.endsWith('A')) {
        label += ' (Amendment)';
      }
      labels.push([report.id as string, label]);
    }

    return labels;
  }

  public async linkToSelectedReport() {
    const transaction = this.transaction();
    const report = this.selectedReport();
    if (!report || !transaction) return;
    const response = await this.transactionService.addToReport(transaction, report);
    this.createEventMethod();
    this.closeDialog();
    if (response.status === 200) {
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: `Transaction added to ${this.reportType} Report`,
        key: 'reportLinkToast',
        life: 3000,
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: `Transaction was not added to ${this.reportType} Report`,
        key: 'reportLinkToast',
        life: 3000,
      });
    }
  }

  closeDialog() {
    this.dialogClose.emit(undefined);
  }

  showDialog() {
    this.select().applyFocus();
  }
}

const sortReport = (a: Report, b: Report) => {
  const aTime = a.created?.getTime() ?? 0;
  const bTime = b.created?.getTime() ?? 0;
  return aTime - bTime;
};
