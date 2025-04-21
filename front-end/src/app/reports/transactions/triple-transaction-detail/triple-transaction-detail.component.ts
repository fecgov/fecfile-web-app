import { Component, OnInit } from '@angular/core';
import { TripleTransactionTypeBaseComponent } from 'app/shared/components/transaction-type-base/triple-transaction-type-base.component';
import { AccordionModule } from 'primeng/accordion';
import { ReactiveFormsModule } from '@angular/forms';
import { TransactionInputComponent } from '../transaction-input/transaction-input.component';
import { IndependentExpenditureCreateF3xInputComponent } from 'app/shared/components/inputs/independent-expenditure-create-f3x-input/independent-expenditure-create-f3x-input.component';

@Component({
  selector: 'app-triple-transaction-detail',
  templateUrl: './triple-transaction-detail.component.html',
  styleUrls: ['../transaction.scss', './triple-transaction-detail.component.scss'],
  imports: [
    IndependentExpenditureCreateF3xInputComponent,
    AccordionModule,
    ReactiveFormsModule,
    TransactionInputComponent,
  ],
})
export class TripleTransactionDetailComponent extends TripleTransactionTypeBaseComponent implements OnInit {
  override ngOnInit() {
    super.ngOnInit();
    const transactionId = this.activatedRoute.snapshot.params['transactionId'];
    if (transactionId && this.childTransaction_2()?.id === transactionId) {
      this.accordion()?.value.set(2);
    }
  }
}
