import { Component, OnDestroy, OnInit } from '@angular/core';
import { TransactionTypeBaseComponent } from 'app/shared/components/transaction-type-base/transaction-type-base.component';
import { LabelUtils, PrimeOptions } from 'app/shared/utils/label.utils';
import { ContactTypeLabels, ContactTypes } from '../../shared/models/contact.model';

@Component({
  selector: 'app-transaction-group-i',
  templateUrl: './transaction-group-i.component.html',
  styleUrls: ['../transaction.scss'],
})
export class TransactionGroupIComponent extends TransactionTypeBaseComponent implements OnInit, OnDestroy {
  formProperties: string[] = [
    'entity_type',
    'contributor_organization_name',
    'contributor_street_1',
    'contributor_street_2',
    'contributor_city',
    'contributor_state',
    'contributor_zip',
    'election_code',
    'election_other_description',
    'contribution_date',
    'contribution_amount',
    'contribution_aggregate',
    'contribution_purpose_descrip',
    'donor_committee_fec_id',
    'donor_committee_name',
    'memo_code',
    'memo_text_input',
    'subTransaction',
  ];

  override contactTypeOptions: PrimeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels, [ContactTypes.COMMITTEE]);

  override ngOnInit(): void {
    super.ngOnInit();
  }
}
