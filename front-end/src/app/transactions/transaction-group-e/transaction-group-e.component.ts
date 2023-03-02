import { Component, OnDestroy, OnInit } from '@angular/core';
import { TransactionTypeBaseComponent } from 'app/shared/components/transaction-type-base/transaction-type-base.component';
import { ScheduleATransactionTypeLabels, ScheduleATransactionTypes } from 'app/shared/models/scha-transaction.model';
import { LabelUtils, PrimeOptions } from 'app/shared/utils/label.utils';
import { ContactTypeLabels, ContactTypes } from '../../shared/models/contact.model';

@Component({
  selector: 'app-transaction-group-e',
  templateUrl: './transaction-group-e.component.html',
  styleUrls: ['../transaction.scss'],
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
    'memo_text_input',
    'subTransaction',
  ];

  override contactTypeOptions: PrimeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels, [ContactTypes.COMMITTEE]);

  override ngOnInit(): void {
    super.ngOnInit();
  }
}
