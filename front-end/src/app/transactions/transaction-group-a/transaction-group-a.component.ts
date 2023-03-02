import { Component, OnDestroy, OnInit } from '@angular/core';
import { TransactionTypeBaseComponent } from 'app/shared/components/transaction-type-base/transaction-type-base.component';
import { LabelUtils, PrimeOptions } from 'app/shared/utils/label.utils';
import { ContactTypeLabels, ContactTypes } from '../../shared/models/contact.model';

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
    'memo_text_input',
  ];

  override ngOnInit(): void {
    if (this.transaction?.transactionType?.scheduleId === 'B') {
      this.formProperties = [
        'entity_type',
        'payee_last_name',
        'payee_first_name',
        'payee_middle_name',
        'payee_prefix',
        'payee_suffix',
        'payee_street_1',
        'payee_street_2',
        'payee_city',
        'payee_state',
        'payee_zip',
        'expenditure_date',
        'expenditure_amount',
        'aggregate_amount',
        'expenditure_purpose_descrip',
        'memo_code',
        'memo_text_input',
        'category_code',
      ];
    }
    super.ngOnInit();
  }

  override contactTypeOptions: PrimeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels, [ContactTypes.INDIVIDUAL]);
}
