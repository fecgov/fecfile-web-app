import { Component, OnInit } from '@angular/core';
import { TripleTransactionTypeBaseComponent } from 'app/shared/components/transaction-type-base/triple-transaction-type-base.component';

@Component({
  selector: 'app-triple-transaction-detail',
  templateUrl: './triple-transaction-detail.component.html',
  styleUrls: ['../transaction.scss', './triple-transaction-detail.component.scss'],
})
export class TripleTransactionDetailComponent extends TripleTransactionTypeBaseComponent implements OnInit {
  override ngOnInit(): void {
    super.ngOnInit();

    // Determine which accordion pane to open initially based on transaction id in page URL
    const transactionId = this.activatedRoute.snapshot.params['transactionId'];

    if (this.childTransaction_2 && transactionId && this.childTransaction_2?.id === transactionId) {
      this.accordionActiveIndex = 2;
    }
  }
}
