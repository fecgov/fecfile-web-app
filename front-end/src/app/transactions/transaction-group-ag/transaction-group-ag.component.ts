import { Component, OnDestroy, OnInit } from '@angular/core';
import { DoubleTransactionTypeBaseComponent } from 'app/shared/components/transaction-type-base/double-transaction-type-base.component';
import { ContactTypeLabels, ContactTypes } from 'app/shared/models/contact.model';
import { LabelUtils, PrimeOptions } from 'app/shared/utils/label.utils';

@Component({
  selector: 'app-transaction-group-ag',
  templateUrl: './transaction-group-ag.component.html',
})
export class TransactionGroupAgComponent extends DoubleTransactionTypeBaseComponent implements OnInit, OnDestroy {
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
    'memo_text_input',
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
    'donor_committee_name',
    'memo_code',
    'memo_text_input',
  ];
  override contactTypeOptions: PrimeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels, [ContactTypes.INDIVIDUAL]);
  override childContactTypeOptions: PrimeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels, [
    ContactTypes.INDIVIDUAL,
    ContactTypes.COMMITTEE,
  ]);
}