import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { TransactionTypeBaseComponent } from 'app/shared/components/transaction-type-base/transaction-type-base.component';
import { ContactTypeLabels, ContactTypes } from 'app/shared/models/contact.model';
import { TransactionService } from 'app/shared/services/transaction.service';
import { ValidateService } from 'app/shared/services/validate.service';
import { LabelUtils, PrimeOptions } from 'app/shared/utils/label.utils';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-transaction-group-ag',
  templateUrl: './transaction-group-ag.component.html',
})
export class TransactionGroupAgComponent extends TransactionTypeBaseComponent implements OnInit, OnDestroy {
  formProperties: string[] = [
    'entity_type',
    'contributor_last_name',
    'contributor_first_name',
    'contributor_middle_name',
    'contributor_prefix',
    'contributor_suffix',
    'contributor_street_1',
    'contributor_street_2',
    'contributor_city',
    'contributor_state',
    'contributor_zip',
    'contribution_date',
    'contribution_amount',
    'contribution_aggregate',
    'contribution_purpose_descrip',
    'contributor_employer',
    'contributor_occupation',
    'memo_code',
    'memo_text_description',
  ];

  childFormProperties: string[] = [
    'entity_type',
    'contributor_organization_name',
    'contributor_last_name',
    'contributor_first_name',
    'contributor_middle_name',
    'contributor_prefix',
    'contributor_suffix',
    'contributor_street_1',
    'contributor_street_2',
    'contributor_city',
    'contributor_state',
    'contributor_zip',
    'contribution_date',
    'contribution_amount',
    'contribution_aggregate',
    'contribution_purpose_descrip',
    'contributor_employer',
    'contributor_occupation',
    'donor_committee_fec_id',
    'memo_code',
    'memo_text_description',
  ];
  override childContactTypeOptions: PrimeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels).filter((option) =>
    [ContactTypes.COMMITTEE, ContactTypes.INDIVIDUAL].includes(option.code as ContactTypes)
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
