import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { FecDatePipe } from 'app/shared/pipes/fec-date.pipe';
import { ContactService } from 'app/shared/services/contact.service';
import { TransactionService } from 'app/shared/services/transaction.service';
import { ValidateService } from 'app/shared/services/validate.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TransactionTypeBaseComponent } from '../transaction-type-base/transaction-type-base.component';

@Component({
  template: '',
})
export abstract class SchaGroupTransactionBaseComponent extends TransactionTypeBaseComponent implements OnInit {
  contributionPurposeDescriptionLabel = '';

  constructor(
    protected override messageService: MessageService,
    protected override transactionService: TransactionService,
    protected override contactService: ContactService,
    protected override validateService: ValidateService,
    protected override confirmationService: ConfirmationService,
    protected override fb: FormBuilder,
    protected override router: Router,
    protected override fecDatePipe: FecDatePipe
  ) {
    super(
      messageService,
      transactionService,
      contactService,
      validateService,
      confirmationService,
      fb,
      router,
      fecDatePipe
    );
  }

  override ngOnInit(): void {
    super.ngOnInit();
    if (super.isDescriptionSystemGenerated(this.transactionType)) {
      this.contributionPurposeDescriptionLabel = '(SYSTEM-GENERATED)';
    } else if (!this.transactionType?.purposeDescriptionUserInputRequired) {
      this.contributionPurposeDescriptionLabel = '(OPTIONAL)';
    }
  }

}
