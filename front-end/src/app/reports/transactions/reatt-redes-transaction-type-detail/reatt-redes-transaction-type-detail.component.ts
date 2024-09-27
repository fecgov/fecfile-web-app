import { Component, OnInit } from '@angular/core';
import { ReattRedesTransactionTypeBaseComponent } from '../../../shared/components/transaction-type-base/reatt-redes-transaction-type-base.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TransactionService } from '../../../shared/services/transaction.service';
import { ContactService } from '../../../shared/services/contact.service';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FecDatePipe } from '../../../shared/pipes/fec-date.pipe';
import { Store } from '@ngrx/store';
import { ReportService } from '../../../shared/services/report.service';

@Component({
  selector: 'app-reatt-redes-transaction-type-detail',
  templateUrl: './reatt-redes-transaction-type-detail.component.html',
  styleUrls: ['../transaction.scss', './reatt-redes-transaction-type-detail.component.scss'],
})
export class ReattRedesTransactionTypeDetailComponent extends ReattRedesTransactionTypeBaseComponent implements OnInit {
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

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();
    const transactionId = this.activatedRoute.snapshot.params['transactionId'];
    if (this.childTransaction && transactionId && this.childTransaction?.id === transactionId) {
      this.accordionActiveIndex = 1;
    }
  }
}
