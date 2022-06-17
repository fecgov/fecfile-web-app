import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { TransactionTypeBaseComponent } from 'app/shared/components/transaction-type-base/transaction-type-base.component';
import { ContactTypes, ContactTypeLabels } from '../../shared/models/contact.model';
import { LabelUtils, PrimeOptions } from 'app/shared/utils/label.utils';
import { TransactionService } from 'app/shared/services/transaction.service';
import { ValidateService } from 'app/shared/services/validate.service';

@Component({
  selector: 'app-transaction-group-f',
  templateUrl: './transaction-group-f.component.html',
})
export class TransactionGroupFComponent extends TransactionTypeBaseComponent implements OnInit, OnDestroy {
  formProperties: string[] = [
    'entity_type',
    'contributor_organization_name',
    'contributor_fec_id',
    'contributor_street_1',
    'contributor_street_2',
    'contributor_city',
    'contributor_state',
    'contributor_zip',
    'contribution_date',
    'contribution_amount',
    'contribution_aggregate',
    'contribution_purpose_descrip',
    'memo_code',
    'memo_text_description',
  ];
  override contactTypeOptions: PrimeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels).filter((option) =>
    [ContactTypes.COMMITTEE].includes(option.code as ContactTypes)
  );

  constructor(
    protected override messageService: MessageService,
    protected override transactionService: TransactionService,
    protected override validateService: ValidateService,
    protected override fb: FormBuilder,
    protected override router: Router
  ) {
    super(messageService, transactionService, validateService, fb, router);
  }
}
