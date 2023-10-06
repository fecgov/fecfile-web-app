import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { ReportF3X, F3xFormTypeLabels } from 'app/shared/models/report-f3x.model';
import { TableAction } from 'app/shared/components/table-list-base/table-list-base.component';
import { LabelList } from 'app/shared/utils/label.utils';
import { DestroyerComponent } from 'app/shared/components/app-destroyer.component';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['../transaction.scss'],
})
export class TransactionListComponent extends DestroyerComponent implements OnInit {
  report: ReportF3X | undefined;
  f3xFormTypeLabels: LabelList = F3xFormTypeLabels;

  public tableActions: TableAction[] = [
    new TableAction(
      'Add a receipt',
      this.createTransactions.bind(this, 'receipt'),
      (report: ReportF3X) => report.report_status === 'In progress',
      () => true
    ),
    new TableAction(
      'Add a disbursement',
      this.createTransactions.bind(this, 'disbursement'),
      (report: ReportF3X) => report.report_status === 'In progress',
      () => true
    ),
    new TableAction(
      'Add loans and debts',
      this.createTransactions.bind(this, 'loans-and-debts'),
      (report: ReportF3X) => report.report_status === 'In progress',
      () => true
    ),
    new TableAction(
      'Add other transactions',
      this.createTransactions.bind(this, 'other-transactions'),
      (report: ReportF3X) => report.report_status === 'In progress',
      () => false
    ),
  ];

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private store: Store) {
    super();
  }

  ngOnInit(): void {
    this.store
      .select(selectActiveReport)
      .pipe(takeUntil(this.destroy$))
      .subscribe((report) => (this.report = report as ReportF3X));
  }

  createTransactions(transactionCategory: string, report?: ReportF3X): void {
    this.router.navigateByUrl(`/reports/transactions/report/${report?.id}/select/${transactionCategory}`);
  }

  public onTableActionClick(action: TableAction, report?: ReportF3X) {
    action.action(report);
  }
}

@Pipe({ name: 'memoCode' })
export class MemoCodePipe implements PipeTransform {
  transform(value: boolean) {
    return value ? 'Y' : '-';
  }
}
