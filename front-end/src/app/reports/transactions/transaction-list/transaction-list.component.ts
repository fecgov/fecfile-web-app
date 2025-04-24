import { Component, inject, Pipe, PipeTransform, signal, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { createAction } from 'app/shared/components/table-list-base/table-list-base.component';
import { Report, ReportStatus, ReportTypes } from 'app/shared/models/report.model';
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
  ],
})
export class TransactionListComponent {
  private readonly router = inject(Router);
  private readonly store = inject(Store);
  readonly reportTypes = ReportTypes;
  readonly reportStatus = ReportStatus;

  readonly selectActiveReport = this.store.selectSignal(selectActiveReport);

  readonly reportSelectDialogVisible = signal(false);
  reportSelectFormType: ReportTypes | undefined;
  reportSelectionTransaction: Transaction | undefined;
  reportSelectionCreateMethod = () => {
    return;
  };

  public tableActions = [
    createAction('Add a receipt', this.createTransactions.bind(this, 'receipt'), {
      isAvailable: (report: Report) => {
        return (
          report.report_status === ReportStatus.IN_PROGRESS &&
          [ReportTypes.F3, ReportTypes.F3X].includes(report.report_type)
        );
      },
    }),
    createAction('Add a disbursement', this.createTransactions.bind(this, 'disbursement'), {
      isAvailable: (report: Report) => {
        return (
          report.report_status === ReportStatus.IN_PROGRESS &&
          [ReportTypes.F3, ReportTypes.F3X].includes(report.report_type)
        );
      },
    }),
    createAction('Add loans and debts', this.createTransactions.bind(this, 'loans-and-debts'), {
      isAvailable: (report: Report) => {
        return (
          report.report_status === ReportStatus.IN_PROGRESS &&
          [ReportTypes.F3, ReportTypes.F3X].includes(report.report_type)
        );
      },
    }),
    createAction('Add other transactions', this.createTransactions.bind(this, 'other-transactions'), {
      isAvailable: (report: Report) => {
        return (
          report.report_status === ReportStatus.IN_PROGRESS &&
          [ReportTypes.F3, ReportTypes.F3X].includes(report.report_type)
        );
      },
      isEnabled: () => false,
    }),
    createAction('Add an independent expenditure', this.createF24Transactions.bind(this), {
      isAvailable: (report: Report) => {
        return report.report_status === ReportStatus.IN_PROGRESS && report.report_type === ReportTypes.F24;
      },
    }),
  ];

  readonly receipts = viewChild.required(TransactionReceiptsComponent);
  readonly disbursements = viewChild.required(TransactionDisbursementsComponent);
  readonly loans = viewChild.required(TransactionLoansAndDebtsComponent);

  async createTransactions(transactionCategory: string, report?: Report): Promise<void> {
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

  refreshTables() {
    this.receipts().refreshTable();
    this.disbursements().refreshTable();
    this.loans().refreshTable();
  }
}

@Pipe({ name: 'memoCode' })
export class MemoCodePipe implements PipeTransform {
  transform(value: boolean) {
    return value ? 'Y' : '-';
  }
}
