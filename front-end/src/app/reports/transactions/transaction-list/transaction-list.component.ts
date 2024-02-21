import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { TableAction } from 'app/shared/components/table-list-base/table-list-base.component';
import { DestroyerComponent } from 'app/shared/components/app-destroyer.component';
import { Report, ReportStatus, ReportTypes } from 'app/shared/models/report.model';
import { ReportService } from "../../../shared/services/report.service";
import { Transaction } from "../../../shared/models/transaction.model";

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['../transaction.scss'],
})
export class TransactionListComponent extends DestroyerComponent implements OnInit {
  report: Report | undefined;
  reportTypes = ReportTypes;
  reportStatus = ReportStatus;

  availableReports: Report[] = [];
  public tableActions: TableAction[] = [
    new TableAction(
      'Add a receipt',
      this.createTransactions.bind(this, 'receipt'),
      (report: Report) => {
        return report.report_status === ReportStatus.IN_PROGRESS && report.report_type === ReportTypes.F3X;
      },
      () => true
    ),
    new TableAction(
      'Add a disbursement',
      this.createTransactions.bind(this, 'disbursement'),
      (report: Report) => {
        return report.report_status === ReportStatus.IN_PROGRESS && report.report_type === ReportTypes.F3X;
      },
      () => true
    ),
    new TableAction(
      'Add loans and debts',
      this.createTransactions.bind(this, 'loans-and-debts'),
      (report: Report) => {
        return report.report_status === ReportStatus.IN_PROGRESS && report.report_type === ReportTypes.F3X;
      },
      () => true
    ),
    new TableAction(
      'Add other transactions',
      this.createTransactions.bind(this, 'other-transactions'),
      (report: Report) => {
        return report.report_status === ReportStatus.IN_PROGRESS && report.report_type === ReportTypes.F3X;
      },
      () => false
    ),
    new TableAction(
      'Add an independent expenditure',
      this.createF24Transactions.bind(this),
      (report: Report) => {
        return report.report_status === ReportStatus.IN_PROGRESS && report.report_type === ReportTypes.F24;
      },
      () => true
    ),
  ];
  transaction?: Transaction;

  constructor(private router: Router, private store: Store, private reportService: ReportService) {
    super();
  }

  async ngOnInit(): Promise<void> {
    this.store
      .select(selectActiveReport)
      .pipe(takeUntil(this.destroy$))
      .subscribe((report) => (this.report = report));
  }


  async createTransactions(transactionCategory: string, report?: Report): Promise<void> {
    await this.router.navigateByUrl(`/reports/transactions/report/${report?.id}/select/${transactionCategory}`);
  }

  async createF24Transactions(report?: Report): Promise<void> {
    await this.router.navigateByUrl(`/reports/f24/report/${report?.id}/transactions/select/independent-expenditures`);
  }

  public onTableActionClick(action: TableAction, report?: Report) {
    action.action(report);
  }
}

@Pipe({name: 'memoCode'})
export class MemoCodePipe implements PipeTransform {
  transform(value: boolean) {
    return value ? 'Y' : '-';
  }
}
