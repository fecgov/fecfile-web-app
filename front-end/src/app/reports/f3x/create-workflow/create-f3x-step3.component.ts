import { Component, ElementRef, OnDestroy, OnInit, Pipe, PipeTransform } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { refreshCommitteeAccountDetailsAction } from '../../../store/committee-account.actions';
import { selectCommitteeAccount } from 'app/store/committee-account.selectors';
import { F3xSummary } from 'app/shared/models/f3x-summary.model';
import { F3xSummaryService } from 'app/shared/services/f3x-summary.service';
import { CommitteeAccount } from 'app/shared/models/committee-account.model';
import { TableListBaseComponent } from 'app/shared/components/table-list-base/table-list-base.component';
import { Transaction } from 'app/shared/interfaces/transaction.interface';
import { ConfirmationService, LazyLoadEvent, MessageService, SortEvent, SortMeta } from 'primeng/api';
import { TransactionService } from 'app/shared/services/transaction.service';

@Component({
  selector: 'app-create-f3x-step3',
  templateUrl: './create-f3x-step3.component.html',
})
export class CreateF3xStep3Component extends TableListBaseComponent<Transaction> implements OnInit, OnDestroy {
  report: F3xSummary | undefined;
  destroy$: Subject<boolean> = new Subject<boolean>();
  committeeAccount$: Observable<CommitteeAccount> = this.store.select(selectCommitteeAccount);

  constructor(
    protected override messageService: MessageService,
    protected override confirmationService: ConfirmationService,
    protected override elementRef: ElementRef,
    protected override itemService: TransactionService,
    private activatedRoute: ActivatedRoute,
    private store: Store
  ) {
    super(messageService, confirmationService, elementRef);
  }

  ngOnInit(): void {
    // Refresh committee account details whenever page loads
    this.store.dispatch(refreshCommitteeAccountDetailsAction());

    this.report = this.activatedRoute.snapshot.data['report'];
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  protected getEmptyItem(): Transaction {
    return {} as Transaction;
  }
}

@Pipe({ name: 'memoCode' })
export class MemoCodePipe implements PipeTransform {
  transform(value: boolean) {
    return value ? 'Y' : '-';
  }
}
