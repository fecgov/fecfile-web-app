import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { TransactionTypeBaseComponent } from 'app/shared/components/transaction-type-base/transaction-type-base.component';
import { ContactService } from 'app/shared/services/contact.service';
import { TransactionService } from 'app/shared/services/transaction.service';
import { ValidateService } from 'app/shared/services/validate.service';
import { LabelUtils, PrimeOptions } from 'app/shared/utils/label.utils';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ContactTypeLabels, ContactTypes } from '../../shared/models/contact.model';

@Component({
  selector: 'app-transaction-group-e',
  templateUrl: './transaction-group-e.component.html',
})
export class TransactionGroupEComponent extends TransactionTypeBaseComponent implements OnInit, OnDestroy {
  formProperties: string[] = [
    'entity_type',
    'contributor_organization_name',
    'contributor_street_1',
    'contributor_street_2',
    'contributor_city',
    'contributor_state',
    'contributor_zip',
    'contribution_date',
    'contribution_amount',
    'contribution_aggregate',
    'contribution_purpose_descrip',
    'donor_committee_fec_id',
    'memo_code',
    'memo_text_description',
  ];
  override contactTypeOptions: PrimeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels).filter((option) =>
    [ContactTypes.COMMITTEE].includes(option.code as ContactTypes)
  );

  constructor(
    protected override messageService: MessageService,
    protected override transactionService: TransactionService,
    protected override contactService: ContactService,
    protected override validateService: ValidateService,
    protected override confirmationService: ConfirmationService,
    protected override fb: FormBuilder,
    protected override router: Router
  ) {
    super(messageService, transactionService, contactService, validateService, confirmationService, fb, router);
  }
}
