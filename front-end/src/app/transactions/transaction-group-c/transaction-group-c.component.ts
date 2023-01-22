import { Component, OnDestroy, OnInit } from '@angular/core';
import { TransactionTypeBaseComponent } from 'app/shared/components/transaction-type-base/transaction-type-base.component';
import { LabelUtils, PrimeOptions } from 'app/shared/utils/label.utils';
import { ContactTypeLabels, ContactTypes } from '../../shared/models/contact.model';

@Component({
  selector: 'app-transaction-group-c',
  templateUrl: './transaction-group-c.component.html',
})
export class TransactionGroupCComponent extends TransactionTypeBaseComponent implements OnInit, OnDestroy {
  formProperties: string[] = [
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
    'memo_code',
    'memo_text_input',
  ];
  override contactTypeOptions: PrimeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels).filter((option) =>
    [ContactTypes.INDIVIDUAL, ContactTypes.ORGANIZATION, ContactTypes.COMMITTEE].includes(option.code as ContactTypes)
  );
}
