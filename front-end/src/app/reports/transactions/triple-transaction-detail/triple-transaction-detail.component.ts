import { Component, OnInit } from '@angular/core';
import { TripleTransactionTypeBaseComponent } from 'app/shared/components/transaction-type-base/triple-transaction-type-base.component';
import { AsyncPipe } from '@angular/common';
import { IndependentExpenditureCreateF3xInputComponent } from '../../../shared/components/inputs/independent-expenditure-create-f3x-input/independent-expenditure-create-f3x-input.component';
import { AccordionModule } from 'primeng/accordion';
import { ReactiveFormsModule } from '@angular/forms';
import { TransactionInputComponent } from '../transaction-input/transaction-input.component';

@Component({
  selector: 'app-triple-transaction-detail',
  templateUrl: './triple-transaction-detail.component.html',
  styleUrls: ['../transaction.scss', './triple-transaction-detail.component.scss'],
  imports: [
    IndependentExpenditureCreateF3xInputComponent,
    AccordionModule,
    ReactiveFormsModule,
    TransactionInputComponent,
    AsyncPipe,
  ],
})
export class TripleTransactionDetailComponent extends TripleTransactionTypeBaseComponent implements OnInit {
  override ngOnInit(): void {
    super.ngOnInit();

    // Determine which accordion pane to open initially based on transaction id in page URL
    const transactionId = this.activatedRoute.snapshot.params['transactionId'];

    if (this.childTransaction_2 && transactionId && this.childTransaction_2?.id === transactionId) {
      this.accordion?.value.set(2);
    }
  }
}
