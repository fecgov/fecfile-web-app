import { Component, OnDestroy, OnInit } from '@angular/core';
import { TransactionTypeBaseComponent } from 'app/shared/components/transaction-type-base/transaction-type-base.component';
import { ScheduleATransactionTypeLabels, ScheduleATransactionTypes } from 'app/shared/models/scha-transaction.model';
import { ScheduleBTransactionTypeLabels } from 'app/shared/models/schb-transaction.model';
import { LabelList, LabelUtils, PrimeOptions } from 'app/shared/utils/label.utils';
import { ContactTypeLabels, ContactTypes } from '../../shared/models/contact.model';

@Component({
  selector: 'app-transaction-group-d',
  templateUrl: './transaction-group-d.component.html',
  styleUrls: ['../transaction.scss'],
})
export class TransactionGroupDComponent extends TransactionTypeBaseComponent implements OnInit, OnDestroy {
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
    'memo_code',
    'memo_text_input',
    'subTransaction',
  ];
  subTransactionOptions: { [key: string]: string | ScheduleATransactionTypes }[] = [];

  override contactTypeOptions: PrimeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels, [
    ContactTypes.ORGANIZATION,
  ]);

  override ngOnInit(): void {
    if (this.transaction?.transactionType?.scheduleId === 'B') {
      this.formProperties = [
        'entity_type',
        'payee_organization_name',
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
    this.subTransactionOptions = (this.transaction?.transactionType?.subTransactionTypes || []).map((type) => {
      let scheduleLabels: LabelList | undefined;

      if (this.transaction?.transactionType?.scheduleId === 'A') scheduleLabels = ScheduleATransactionTypeLabels;
      if (this.transaction?.transactionType?.scheduleId === 'B') scheduleLabels = ScheduleBTransactionTypeLabels;

      if (scheduleLabels !== undefined) {
        return {
          label: LabelUtils.get(scheduleLabels, type),
          value: type,
        };
      }

      return {
        label: 'Label not found',
        value: type,
      };
    });
  }
}
