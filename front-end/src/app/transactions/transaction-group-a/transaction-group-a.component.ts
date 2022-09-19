import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { TransactionTypeBaseComponent } from 'app/shared/components/transaction-type-base/transaction-type-base.component';
import { ContactTypes, ContactTypeLabels, Contact, FecApiLookupData } from '../../shared/models/contact.model';
import { LabelUtils, PrimeOptions } from 'app/shared/utils/label.utils';
import { TransactionService } from 'app/shared/services/transaction.service';
import { ValidateService } from 'app/shared/services/validate.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-transaction-group-a',
  templateUrl: './transaction-group-a.component.html',
})
export class TransactionGroupAComponent extends TransactionTypeBaseComponent implements OnInit, OnDestroy {
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
  override contactTypeOptions: PrimeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels).filter((option) =>
    [ContactTypes.INDIVIDUAL].includes(option.code as ContactTypes)
  );

  contactLookupCompontent = ViewChild('app-contact-lookup');
  $fecfileContactSelect: Observable<Contact> | undefined;
  $fecApiLookupSelect: Observable<FecApiLookupData> | undefined;

  constructor(
    protected override messageService: MessageService,
    protected override transactionService: TransactionService,
    protected override validateService: ValidateService,
    protected override fb: FormBuilder,
    protected override router: Router
  ) {
    super(messageService, transactionService, validateService, fb, router);
  }

  ngAfterViewInit() {
    console.log(this.contactLookupCompontent);
    this.$fecfileContactSelect = this.contactLookupCompontent.fecfileContactSelect.subscribe((event: Contact) =>
      this.patchContact(event)
    );
  }

  patchContact(contact: Contact) {
    console.log(contact);
  }
}
