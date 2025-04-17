import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Accordion, AccordionPanel, AccordionHeader, AccordionContent } from 'primeng/accordion';
import { Ripple } from 'primeng/ripple';
import { TransactionInputComponent } from '../transaction-input/transaction-input.component';
import { ReattRedesTransactionTypeBaseComponent } from 'app/shared/components/transaction-type-base/reatt-redes-transaction-type-base.component';

@Component({
  selector: 'app-reatt-redes-transaction-type-detail',
  templateUrl: './reatt-redes-transaction-type-detail.component.html',
  styleUrls: ['../transaction.scss', './reatt-redes-transaction-type-detail.component.scss'],
  imports: [
    Accordion,
    AccordionPanel,
    Ripple,
    AccordionHeader,
    AccordionContent,
    ReactiveFormsModule,
    TransactionInputComponent,
  ],
})
export class ReattRedesTransactionTypeDetailComponent extends ReattRedesTransactionTypeBaseComponent {
  constructor() {
    super();
    const transactionId = this.activatedRoute.snapshot.params['transactionId'];
    if (transactionId && this.childTransaction()?.id === transactionId) {
      this.accordion().value.set(1);
    }
  }
}
