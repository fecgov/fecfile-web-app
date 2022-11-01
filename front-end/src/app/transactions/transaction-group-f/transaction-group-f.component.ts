import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TransactionTypeBaseComponent } from 'app/shared/components/transaction-type-base/transaction-type-base.component';
import { LabelUtils, PrimeOptions } from 'app/shared/utils/label.utils';
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
    if (this.memoCodeMustBeTrue()) {
      this.readOnlyMemo = true;
      this.form.get('memo_code')?.setValue(true);
    }
  }

  protected memoCodeMustBeTrue(): boolean {
    // Look at validation schema to determine if the memo_code must be true in all cases.
    const memoCodeSchema = this.transactionType?.schema.properties['memo_code'];
    return !!memoCodeSchema?.const;
  }

  protected override doResetForm(form: FormGroup, transactionType?: TransactionType) {
    this.formSubmitted = false;
    form.reset();
    form.markAsPristine();
    form.markAsUntouched();
    form.patchValue({
      entity_type: this.contactTypeOptions[0]?.code,
      contribution_aggregate: '0',
      memo_code: this.memoCodeMustBeTrue(),
      contribution_purpose_descrip: transactionType?.contributionPurposeDescripReadonly(),
    });
  }
}
