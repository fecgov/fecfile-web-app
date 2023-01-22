import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { TransactionTypeBaseComponent } from 'app/shared/components/transaction-type-base/transaction-type-base.component';
import { FecDatePipe } from 'app/shared/pipes/fec-date.pipe';
import { ContactService } from 'app/shared/services/contact.service';
import { TransactionService } from 'app/shared/services/transaction.service';
import { ValidateService } from 'app/shared/services/validate.service';
import { LabelUtils, PrimeOptions } from 'app/shared/utils/label.utils';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ContactTypeLabels, ContactTypes } from '../../shared/models/contact.model';

@Component({
  selector: 'app-transaction-group-d',
  templateUrl: './transaction-group-d.component.html',
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
  ];
  override contactTypeOptions: PrimeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels).filter((option) =>
    [ContactTypes.ORGANIZATION].includes(option.code as ContactTypes)
  );
}
