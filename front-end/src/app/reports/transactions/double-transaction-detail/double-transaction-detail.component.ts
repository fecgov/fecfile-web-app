import { Component } from '@angular/core';
import { DoubleTransactionTypeBaseComponent } from 'app/shared/components/transaction-type-base/double-transaction-type-base.component';
import { IndependentExpenditureCreateF3xInputComponent } from '../../../shared/components/inputs/independent-expenditure-create-f3x-input/independent-expenditure-create-f3x-input.component';
import { AccordionModule } from 'primeng/accordion';
import { Ripple } from 'primeng/ripple';
import { ReactiveFormsModule } from '@angular/forms';
import { TransactionInputComponent } from '../transaction-input/transaction-input.component';

@Component({
  selector: 'app-double-transaction-detail',
  templateUrl: './double-transaction-detail.component.html',
  styleUrls: ['../transaction.scss', './double-transaction-detail.component.scss'],
  imports: [
    IndependentExpenditureCreateF3xInputComponent,
    AccordionModule,
    Ripple,
    ReactiveFormsModule,
    TransactionInputComponent,
  ],
})
export class DoubleTransactionDetailComponent extends DoubleTransactionTypeBaseComponent {}
