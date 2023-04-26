import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { F3xSummary } from 'app/shared/models/f3x-summary.model';
import { TableAction, TableListBaseComponent } from 'app/shared/components/table-list-base/table-list-base.component';
import { Transaction } from 'app/shared/models/transaction.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { LabelList } from 'app/shared/utils/label.utils';

@Component({
  template: '',
})
export abstract class TransactionListTableBaseComponent extends TableListBaseComponent<Transaction> implements OnInit {
  abstract scheduleTransactionTypeLabels: LabelList;

  constructor(
    protected override messageService: MessageService,
    protected override confirmationService: ConfirmationService,
    protected override elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute
  ) {
    super(messageService, confirmationService, elementRef);
  }

  override ngOnInit(): void {
    this.loading = true;
  }

  public onTableActionClick(action: TableAction, report?: F3xSummary) {
    action.action(report);
  }

  protected getEmptyItem(): Transaction {
    return {} as Transaction;
  }

  override getGetParams(): { [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean> } {
    const reportId = this.activatedRoute.snapshot.params['reportId'];
    return { report_id: reportId };
  }
}
