import { AfterViewInit, Component, ElementRef, OnInit, Pipe, PipeTransform, ViewChild } from '@angular/core';
import { lastValueFrom, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { TableAction } from 'app/shared/components/table-list-base/table-list-base.component';
import { DestroyerComponent } from 'app/shared/components/app-destroyer.component';
import { Report, ReportStatus, ReportTypes } from 'app/shared/models/report.model';
import { ReattRedesUtils } from "../../../shared/utils/reatt-redes/reatt-redes.utils";
import { ReportService } from "../../../shared/services/report.service";

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['../transaction.scss', 'transaction-list.component.scss'],
})
export class TransactionListComponent extends DestroyerComponent implements OnInit, AfterViewInit {
  report: Report | undefined;
  reportTypes = ReportTypes;
  reportStatus = ReportStatus;
  availableReports: Report[] = [];
  selectedReport?: Report;

  @ViewChild('selectReportDialog') selectReportDialog?: ElementRef<HTMLDialogElement>;

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

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private store: Store, private reportService: ReportService) {
    super();
  }

  ngOnInit(): void {
    this.store
      .select(selectActiveReport)
      .pipe(takeUntil(this.destroy$))
      .subscribe((report) => (this.report = report));


    ReattRedesUtils.selectReportDialogSubject.subscribe(() => {
      this.selectReportDialog?.nativeElement.show();
    })
  }

  async ngAfterViewInit() {
    const response = await lastValueFrom(this.reportService.getTableData());
    this.availableReports = (response.results as Report[]).filter(report => this.reportService.isEditable(report));
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

  createReattribution() {
    console.log(this.selectedReport?.id ?? "No ID")
  }
}

@Pipe({name: 'memoCode'})
export class MemoCodePipe implements PipeTransform {
  transform(value: boolean) {
    return value ? 'Y' : '-';
  }
}
