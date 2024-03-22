import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DestroyerComponent } from 'app/shared/components/app-destroyer.component';
import { Report, ReportStatus, ReportTypes, reportLabelList } from 'app/shared/models/report.model';
import { Transaction } from 'app/shared/models/transaction.model';
import { LabelPipe } from 'app/shared/pipes/label.pipe';
import { ReportService } from 'app/shared/services/report.service';
import { TransactionService } from 'app/shared/services/transaction.service';
import { LabelList } from 'app/shared/utils/label.utils';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-secondary-report-selection-dialog',
  templateUrl: './secondary-report-selection-dialog.component.html',
  styleUrls: ['./secondary-report-selection-dialog.component.scss'],
})
export class SecondaryReportSelectionDialogComponent extends DestroyerComponent implements OnChanges, AfterViewInit {
  @Input() transaction: Transaction | undefined;
  @Input() dialogVisible = false;
  @Input() createEventMethod = () => {
    return;
  };
  @Output() dialogClose = new EventEmitter<undefined>();
  @ViewChild('dialog') dialog?: ElementRef;

  reports: Report[] = [];
  reportLabels: LabelList = [];

  _reportType: ReportTypes | undefined;
  reportTypeLabels = reportLabelList;

  selectedReport: Report | undefined;
  dropDownFieldText = 'Loading Reports...';

  reportTypes = ReportTypes;

  constructor(
    public router: Router,
    private reportService: ReportService,
    private transactionService: TransactionService,
    private messageService: MessageService,
  ) {
    super();
  }

  ngAfterViewInit() {
    this.dialog?.nativeElement.addEventListener('close', () => this.dialogClose.emit());
  }

  ngOnChanges(): void {
    if (this.dialogVisible) {
      this.dialog?.nativeElement.showModal();
    }
  }

  @Input() set reportType(reportType: ReportTypes | undefined) {
    this._reportType = reportType;
    this.reportService.getAllReports().then((reports) => {
      this.setReports(reports);
    });
  }
  get reportType(): ReportTypes | undefined {
    return this._reportType;
  }

  public setReports(reports: Report[]) {
    this.reports = reports.filter((report) => {
      return report.report_type === this.reportType && report.report_status === ReportStatus.IN_PROGRESS;
    });
    this.reportLabels = this.getReportLabels();
    this.dropDownFieldText = this.getDropdownText();
  }

  public updateSelectedReport(report: Report) {
    this.selectedReport = report;
    this.dropDownFieldText = this.getDropdownText();
  }

  public getReportLabels(): LabelList {
    if (!this.reports) return [];

    const sortedReports = this.reports.sort((a, b) => {
      const aTime = a.created?.getTime() ?? 0;
      const bTime = b.created?.getTime() ?? 0;
      return aTime - bTime;
    });

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

  public getDropdownText(): string {
    if (!this.reports) {
      return `No In-Progress ${this.reportType} Reports are available`;
    }

    if (!this.selectedReport) {
      return `Select a ${this.reportType} Report`;
    } else {
      return new LabelPipe().transform(this.selectedReport.id, this.reportLabels);
    }
  }

  public linkToSelectedReport() {
    if (this.selectedReport && this.transaction) {
      this.transactionService.addToReport(this.transaction, this.selectedReport).then((response) => {
        this.createEventMethod();
        this.dialog?.nativeElement.close();
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
      });
    }
  }
}
