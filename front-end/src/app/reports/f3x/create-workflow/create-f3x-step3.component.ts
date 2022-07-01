import { Component, ElementRef, OnInit, Pipe, PipeTransform } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { F3xSummary } from 'app/shared/models/f3x-summary.model';
import { TableListBaseComponent } from 'app/shared/components/table-list-base/table-list-base.component';
import { Transaction } from 'app/shared/interfaces/transaction.interface';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TransactionService } from 'app/shared/services/transaction.service';

@Component({
  selector: 'app-create-f3x-step3',
  templateUrl: './create-f3x-step3.component.html',
})
export class CreateF3xStep3Component extends TableListBaseComponent<Transaction> implements OnInit {
  report: F3xSummary | undefined;

  constructor(
    protected override messageService: MessageService,
    protected override confirmationService: ConfirmationService,
    protected override elementRef: ElementRef,
    protected override itemService: TransactionService,
    private activatedRoute: ActivatedRoute
  ) {
    super(messageService, confirmationService, elementRef);
  }

  override ngOnInit(): void {
    this.report = this.activatedRoute.snapshot.data['report'];
    this.loading = true;
  }

  protected getEmptyItem(): Transaction {
    return {} as Transaction;
  }

  override filterItem(item: Transaction): boolean {
    const reportId = this.activatedRoute.snapshot.params['reportId'];
    return item.f3x_summary == reportId;
  }
}

@Pipe({ name: 'memoCode' })
export class MemoCodePipe implements PipeTransform {
  transform(value: boolean) {
    return value ? 'Y' : '-';
  }
}
