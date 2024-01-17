import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Report } from "../../../../shared/models/report.model";
import { ReattRedesUtils } from "../../../../shared/utils/reatt-redes/reatt-redes.utils";
import { lastValueFrom } from "rxjs";
import { ReportService } from "../../../../shared/services/report.service";
import { Router } from "@angular/router";
import { Transaction } from "../../../../shared/models/transaction.model";

@Component({
  selector: 'app-select-report-dialog',
  templateUrl: './select-report-dialog.component.html',
  styleUrls: ['./select-report-dialog.component.scss']
})
export class SelectReportDialogComponent implements OnInit {
  availableReports: Report[] = [];
  selectedReport?: Report;

  transaction?: Transaction;
  @ViewChild('selectReportDialog') selectReportDialog?: ElementRef<HTMLDialogElement>;

  constructor(private router: Router, private reportService: ReportService) {
  }

  async ngOnInit() {
    ReattRedesUtils.selectReportDialogSubject.subscribe(transaction => {
      this.transaction = transaction;
      this.selectReportDialog?.nativeElement.show();
    })

    const response = await lastValueFrom(this.reportService.getTableData());
    this.availableReports = (response.results as Report[]).filter(report => this.reportService.isEditable(report));
  }

  async createReattribution() {
    if (!this.transaction) throw new Error("No base transaction");
    await this.router.navigateByUrl(
      `/reports/transactions/report/${this.selectedReport?.id}/create/${this.transaction.transaction_type_identifier}?reattribution=${this.transaction.id}`
    );
  }

  cancel() {
    this.transaction = undefined;
    this.selectReportDialog?.nativeElement.close();
  }
}
