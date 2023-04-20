import { Component, OnDestroy, OnInit } from '@angular/core';
import { TransactionTypeBaseComponent } from 'app/shared/components/transaction-type-base/transaction-type-base.component';
import { LabelUtils, PrimeOptions } from 'app/shared/utils/label.utils';
import { ContactTypeLabels, ContactTypes } from '../../shared/models/contact.model';

@Component({
  selector: 'app-transaction-group-m',
  templateUrl: './transaction-group-m.component.html',
  styleUrls: ['../transaction.scss'],
})
export class TransactionGroupMComponent extends TransactionTypeBaseComponent implements OnInit, OnDestroy {
  formProperties: string[] = [
    'entity_type',
    'payee_organization_name',
    'payee_street_1',
    'payee_street_2',
    'payee_city',
    'payee_state',
    'payee_zip',
    'election_code',
    'election_other_description',
    'expenditure_date',
    'expenditure_amount',
    'aggregate_amount',
    'expenditure_purpose_descrip',
    'category_code',
  ];

  override contactTypeOptions: PrimeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels, [
    ContactTypes.ORGANIZATION,
  ]);

}
