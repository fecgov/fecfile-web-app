import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionTypeBaseComponent } from 'app/shared/components/transaction-type-base/transaction-type-base.component';
import { FecDatePipe } from 'app/shared/pipes/fec-date.pipe';
import { ContactService } from 'app/shared/services/contact.service';
import { TransactionService } from 'app/shared/services/transaction.service';
import { ValidateService } from 'app/shared/services/validate.service';
import { LabelUtils, PrimeOptions } from 'app/shared/utils/label.utils';
import { ConfirmationService, MessageService } from 'primeng/api';
import { takeUntil } from 'rxjs';
import { TransactionType } from '../../shared/interfaces/transaction-type.interface';
import { ContactTypeLabels, ContactTypes } from '../../shared/models/contact.model';

@Component({
  selector: 'app-transaction-group-f',
  templateUrl: './transaction-group-f.component.html',
})
export class TransactionGroupFComponent extends TransactionTypeBaseComponent implements OnInit, OnDestroy {
  formProperties: string[] = [
    'entity_type',
    'contributor_organization_name',
    'donor_committee_fec_id',
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
    'memo_text_description',
  ];
  readOnlyMemo = false;
  override contactTypeOptions: PrimeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels).filter((option) =>
    [ContactTypes.COMMITTEE].includes(option.code as ContactTypes)
  );

  override ngOnInit(): void {
    super.ngOnInit();
    const memoCodeConst = this.getMemoCodeConstFromSchema();
    this.readOnlyMemo = memoCodeConst as boolean;
    this.form.get('memo_code')?.setValue(memoCodeConst);
  }

  protected getMemoCodeConstFromSchema(): boolean | undefined {
    const memoCodeSchema = this.transactionType?.schema.properties['memo_code'];
    return memoCodeSchema?.const as boolean;
  }

  protected override doResetForm(form: FormGroup, transactionType?: TransactionType) {
    this.formSubmitted = false;
    form.reset();
    form.markAsPristine();
    form.markAsUntouched();
    form.patchValue({
      entity_type: this.contactTypeOptions[0]?.code,
      contribution_aggregate: '0',
      memo_code: this.getMemoCodeConstFromSchema(),
      contribution_purpose_descrip: transactionType?.contributionPurposeDescripReadonly(),
    });
  }
}
