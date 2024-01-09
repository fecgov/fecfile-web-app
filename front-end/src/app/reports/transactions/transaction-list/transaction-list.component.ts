import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { TableAction } from 'app/shared/components/table-list-base/table-list-base.component';
import { DestroyerComponent } from 'app/shared/components/app-destroyer.component';
import { Report, ReportTypes } from 'app/shared/models/report.model';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['../transaction.scss'],
})
export class TransactionListComponent extends DestroyerComponent implements OnInit {
  report: Report | undefined;
  reportTypes = ReportTypes;

  public tableActions: TableAction[] = [
    new TableAction(
      'Add a receipt',
      this.createTransactions.bind(this, 'receipt'),
      (report: Report) => {
        return report.report_status === 'In progress' && report.report_type === ReportTypes.F3X;
      },
      () => true
    ),
    new TableAction(
      'Add a disbursement',
      this.createTransactions.bind(this, 'disbursement'),
      (report: Report) => {
        return report.report_status === 'In progress' && report.report_type === ReportTypes.F3X;
      },
      () => true
    ),
    new TableAction(
      'Add loans and debts',
      this.createTransactions.bind(this, 'loans-and-debts'),
      (report: Report) => {
        return report.report_status === 'In progress' && report.report_type === ReportTypes.F3X;
      },
      () => true
    ),
    new TableAction(
      'Add other transactions',
      this.createTransactions.bind(this, 'other-transactions'),
      (report: Report) => {
        return report.report_status === 'In progress' && report.report_type === ReportTypes.F3X;
      },
      () => false
    ),
    new TableAction(
      'Add an independent expenditure',
      this.createF24Transactions.bind(this),
      (report: Report) => {
        return report.report_status === 'In progress' && report.report_type === ReportTypes.F24;
      },
      () => true
    ),
  ];

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private store: Store) {
    super();
  }

  ngOnInit(): void {
    this.store
      .select(selectActiveReport)
      .pipe(takeUntil(this.destroy$))
      .subscribe((report) => (this.report = report));
  }

  createTransactions(transactionCategory: string, report?: Report): void {
    this.router.navigateByUrl(`/reports/transactions/report/${report?.id}/select/${transactionCategory}`);
  }

  createF24Transactions(report?: Report): void {
    this.router.navigateByUrl(`/reports/f24/report/${report?.id}/transactions/select/independent-expenditures`);
  }

  public onTableActionClick(action: TableAction, report?: Report) {
    action.action(report);
  }
}

@Pipe({ name: 'memoCode' })
export class MemoCodePipe implements PipeTransform {
  transform(value: boolean) {
    return value ? 'Y' : '-';
  }
}
