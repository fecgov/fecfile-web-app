import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FecDatePipe } from 'app/shared/pipes/fec-date.pipe';
import { ContactService } from 'app/shared/services/contact.service';
import { ReportService } from 'app/shared/services/report.service';
import { TransactionService } from 'app/shared/services/transaction.service';
import { TripleTransactionTypeBaseComponent } from 'app/shared/components/transaction-type-base/triple-transaction-type-base.component';

@Component({
  selector: 'app-triple-transaction-detail',
  templateUrl: './triple-transaction-detail.component.html',
  styleUrls: ['../transaction.scss', './triple-transaction-detail.component.scss'],
})
export class TripleTransactionDetailComponent extends TripleTransactionTypeBaseComponent implements OnInit {
  accordionActiveIndex = 0; // Value determines which accordion pane to open by default

  constructor(
    protected override messageService: MessageService,
    public override transactionService: TransactionService,
    protected override contactService: ContactService,
    protected override confirmationService: ConfirmationService,
    protected override fb: FormBuilder,
    protected override router: Router,
    protected override fecDatePipe: FecDatePipe,
    protected override store: Store,
    protected override reportService: ReportService,
    protected override activatedRoute: ActivatedRoute,
  ) {
    super(
      messageService,
      transactionService,
      contactService,
      confirmationService,
      fb,
      router,
      fecDatePipe,
      store,
      reportService,
      activatedRoute,
    );
  }

  override ngOnInit(): void {
    super.ngOnInit();

    // Determine which accordion pane to open initially based on transaction id in page URL
    const transactionId = this.activatedRoute.snapshot.params['transactionId'];
    if (this.childTransaction && transactionId && this.childTransaction?.id === transactionId) {
      this.accordionActiveIndex = 1;
    }
    if (this.childTransaction_2 && transactionId && this.childTransaction_2?.id === transactionId) {
      this.accordionActiveIndex = 2;
    }
  }
}
