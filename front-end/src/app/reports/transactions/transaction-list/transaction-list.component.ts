import { Component, computed, inject, signal, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { Report, ReportStatus, ReportTypes } from 'app/shared/models/reports/report.model';
import { Transaction } from '../../../shared/models/transaction.model';
import { TransactionReceiptsComponent } from './transaction-receipts/transaction-receipts.component';
import { TransactionDisbursementsComponent } from './transaction-disbursements/transaction-disbursements.component';
import { TransactionLoansAndDebtsComponent } from './transaction-loans-and-debts/transaction-loans-and-debts.component';
import { Toolbar } from 'primeng/toolbar';
import { PrimeTemplate } from 'primeng/api';
import { TableActionsButtonComponent } from '../../../shared/components/table-actions-button/table-actions-button.component';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ButtonDirective } from 'primeng/button';
import { SelectReportDialogComponent } from './select-report-dialog/select-report-dialog.component';
import { SecondaryReportSelectionDialogComponent } from '../secondary-report-selection-dialog/secondary-report-selection-dialog.component';
import { TableAction } from 'app/shared/components/table-actions-button/table-actions';
import { ConfirmDialogComponent } from 'app/shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['../transaction.scss'],
  imports: [
    Toolbar,
    PrimeTemplate,
    TableActionsButtonComponent,
    TransactionReceiptsComponent,
    TransactionDisbursementsComponent,
    TransactionLoansAndDebtsComponent,
    ConfirmDialog,
    ButtonDirective,
    SelectReportDialogComponent,
    SecondaryReportSelectionDialogComponent,
    ConfirmDialogComponent,
  ],
})
export class TransactionListComponent {
  private readonly router = inject(Router);
  private readonly store = inject(Store);

  readonly report = this.store.selectSignal(selectActiveReport);

  readonly reportSelectDialogVisible = signal(false);
  reportSelectFormType?: ReportTypes;
  reportSelectionTransaction?: Transaction;
  reportSelectionCreateMethod = () => {
    return;
  };

  availableReports: Report[] = [];
  public tableActions: TableAction<Report>[] = [
    new TableAction(
      'Add a receipt',
      this.createTransactions.bind(this, 'receipt'),
      (report: Report) => {
        return (
          report.report_status === ReportStatus.IN_PROGRESS &&
          [ReportTypes.F3, ReportTypes.F3X].includes(report.report_type)
        );
      },
      () => true,
    ),
    new TableAction(
      'Add a disbursement',
      this.createTransactions.bind(this, 'disbursement'),
      (report: Report) => {
        return (
          report.report_status === ReportStatus.IN_PROGRESS &&
          [ReportTypes.F3, ReportTypes.F3X].includes(report.report_type)
        );
      },
      () => true,
    ),
    new TableAction(
      'Add loans and debts',
      this.createTransactions.bind(this, 'loans-and-debts'),
      (report: Report) => {
        return (
          report.report_status === ReportStatus.IN_PROGRESS &&
          [ReportTypes.F3, ReportTypes.F3X].includes(report.report_type)
        );
      },
      () => true,
    ),
    new TableAction(
      'Add other transactions',
      this.createTransactions.bind(this, 'other-transactions'),
      (report: Report) => {
        return (
          report.report_status === ReportStatus.IN_PROGRESS &&
          [ReportTypes.F3, ReportTypes.F3X].includes(report.report_type)
        );
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

  readonly receipts = viewChild.required(TransactionReceiptsComponent);
  readonly disbursements = viewChild.required(TransactionDisbursementsComponent);
  readonly loans = viewChild.required(TransactionLoansAndDebtsComponent);

  readonly isForm24 = computed(() => this.report().report_type === ReportTypes.F24);
  readonly isInProgress = computed(() => this.report().report_status === ReportStatus.IN_PROGRESS);

  async createTransactions(transactionCategory: string, report: Report): Promise<void> {
    await this.router.navigateByUrl(`/reports/transactions/report/${report?.id}/select/${transactionCategory}`);
  }

  async createF24Transactions(report?: Report): Promise<void> {
    await this.router.navigateByUrl(`/reports/f24/report/${report?.id}/transactions/select/independent-expenditures`);
  }

  public openSecondaryReportSelectionDialog(transaction: Transaction, formType: ReportTypes, createMethod: () => void) {
    this.reportSelectDialogVisible.set(true);
    this.reportSelectFormType = formType;
    this.reportSelectionTransaction = transaction;
    this.reportSelectionCreateMethod = createMethod;
  }

  public onTableActionClick(action: TableAction<Report>, report: Report) {
    action.action(report);
  }

  refreshTables() {
    return Promise.all([
      this.receipts().refreshTable(),
      this.disbursements().refreshTable(),
      this.loans().refreshTable(),
    ]);
  }
}
