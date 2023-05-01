import { Component, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, take, takeUntil } from 'rxjs';
import { F3xSummary } from 'app/shared/models/f3x-summary.model';
import { TableAction, TableListBaseComponent } from 'app/shared/components/table-list-base/table-list-base.component';
import { Transaction } from 'app/shared/models/transaction.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { LabelList } from 'app/shared/utils/label.utils';

@Component({
  template: '',
})
export abstract class TransactionListTableBaseComponent
  extends TableListBaseComponent<Transaction>
  implements OnInit, OnDestroy
{
  private destroy$ = new Subject<boolean>();
  abstract scheduleTransactionTypeLabels: LabelList;
  override rowsPerPage = 5;
  paginationPageSizeOptions = [5, 10, 15, 20];

  public rowActions: TableAction[] = [
    new TableAction(
      'Edit',
      this.editItem.bind(this),
      () => true,
      () => true
    ),
    new TableAction(
      'Itemize',
      this.forceItemize.bind(this),
      (transaction: Transaction) => transaction.itemized === false,
      () => true
    ),
    new TableAction(
      'Unitemize',
      this.forceUnitemize.bind(this),
      (transaction: Transaction) => transaction.itemized === true,
      () => true
    ),
  ];

  constructor(
    protected override messageService: MessageService,
    protected override confirmationService: ConfirmationService,
    protected override elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected router: Router
  ) {
    super(messageService, confirmationService, elementRef);
  }

  override ngOnInit(): void {
    this.loading = true;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  public onTableActionClick(action: TableAction, report?: F3xSummary) {
    action.action(report);
  }

  protected getEmptyItem(): Transaction {
    return {} as Transaction;
  }

  override getGetParams(): { [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean> } {
    const reportId = this.activatedRoute.snapshot.params['reportId'];
    return { report_id: reportId, page_size: this.rowsPerPage };
  }

  onRowsPerPageChange() {
    this.loadTableItems({
      first: 0,
      rows: this.rowsPerPage,
    });
  }

  public onRowActionClick(action: TableAction, transaction: Transaction) {
    action.action(transaction);
  }

  override editItem(item: Transaction): void {
    this.router.navigate([`edit/${item.id}`], { relativeTo: this.activatedRoute });
  }

  public forceItemize(transaction: Transaction): void {
    transaction.force_itemized = true;
    this.updateItem(transaction);
  }

  public forceUnitemize(transaction: Transaction): void {
    transaction.force_itemized = false;
    this.updateItem(transaction);
  }

  public updateItem(item: Transaction) {
    if (this.itemService.update) {
      this.itemService
        .update(item)
        .pipe(take(1), takeUntil(this.destroy$))
        .subscribe(() => {
          this.loadTableItems({});
        });
    }
  }
}
