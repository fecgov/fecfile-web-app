import { Component, ElementRef, OnInit, Pipe, PipeTransform, ViewChild } from '@angular/core';
import { takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { TableAction } from 'app/shared/components/table-list-base/table-list-base.component';
import { DestroyerComponent } from 'app/shared/components/app-destroyer.component';
import { Report, ReportStatus, ReportTypes } from 'app/shared/models/report.model';
import { Transaction } from '../../../shared/models/transaction.model';
import { TransactionReceiptsComponent } from './transaction-receipts/transaction-receipts.component';
import { TransactionDisbursementsComponent } from './transaction-disbursements/transaction-disbursements.component';
import { TransactionLoansAndDebtsComponent } from './transaction-loans-and-debts/transaction-loans-and-debts.component';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['../transaction.scss'],
})
export class TransactionListComponent extends DestroyerComponent implements OnInit {
  @ViewChild('reportSelectDialog') reportSelectDialog?: ElementRef;
  report: Report | undefined;
  reportTypes = ReportTypes;
  reportStatus = ReportStatus;

  reportSelectDialogVisible = false;
  reportSelectFormType: ReportTypes | undefined;
  reportSelectionTransaction: Transaction | undefined;
  reportSelectionCreateMethod = () => {
    return;
  };
  openReportSelectDialog = this.openSecondaryReportSelectionDialog.bind(this);

  availableReports: Report[] = [];
  public tableActions: TableAction[] = [
    new TableAction(
      'Add a receipt',
      this.createTransactions.bind(this, 'receipt'),
      (report: Report) => {
        return report.report_status === ReportStatus.IN_PROGRESS && report.report_type === ReportTypes.F3X;
      },
      () => true,
    ),
    new TableAction(
      'Add a disbursement',
      this.createTransactions.bind(this, 'disbursement'),
      (report: Report) => {
        return report.report_status === ReportStatus.IN_PROGRESS && report.report_type === ReportTypes.F3X;
      },
      () => true,
    ),
    new TableAction(
      'Add loans and debts',
      this.createTransactions.bind(this, 'loans-and-debts'),
      (report: Report) => {
        return report.report_status === ReportStatus.IN_PROGRESS && report.report_type === ReportTypes.F3X;
      },
      () => true,
    ),
    new TableAction(
      'Add other transactions',
      this.createTransactions.bind(this, 'other-transactions'),
      (report: Report) => {
        return report.report_status === ReportStatus.IN_PROGRESS && report.report_type === ReportTypes.F3X;
      },
      () => false,
    ),
    new TableAction(
      'Add an independent expenditure',
      this.createF24Transactions.bind(this),
      (report: Report) => {
        return report.report_status === ReportStatus.IN_PROGRESS && report.report_type === ReportTypes.F24;
      },
      () => true,
    ),
  ];
  transaction?: Transaction;

  @ViewChild(TransactionReceiptsComponent) receipts!: TransactionReceiptsComponent;
  @ViewChild(TransactionDisbursementsComponent) disbursements!: TransactionDisbursementsComponent;
  @ViewChild(TransactionLoansAndDebtsComponent) loans!: TransactionLoansAndDebtsComponent;

  constructor(
    private router: Router,
    private store: Store,
  ) {
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

  public openSecondaryReportSelectionDialog(transaction: Transaction, formType: ReportTypes, createMethod: () => void) {
    this.reportSelectDialogVisible = true;
    this.reportSelectFormType = formType;
    this.reportSelectionTransaction = transaction;
    this.reportSelectionCreateMethod = createMethod;
  }

  public onTableActionClick(action: TableAction, report?: Report) {
    action.action(report);
  }

  refreshTables() {
    this.receipts.refreshTable();
    this.disbursements.refreshTable();
    this.loans.refreshTable();
  }
}

@Pipe({ name: 'memoCode' })
export class MemoCodePipe implements PipeTransform {
  transform(value: boolean) {
    return value ? 'Y' : '-';
  }
}
