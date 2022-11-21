import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs';
import { TransactionTypeX2BaseComponent } from 'app/shared/components/transaction-type-x2-base/transaction-type-x2-base.component';
import { ContactTypeLabels, ContactTypes } from 'app/shared/models/contact.model';
import { FecDatePipe } from 'app/shared/pipes/fec-date.pipe';
import { ContactService } from 'app/shared/services/contact.service';
import { TransactionService } from 'app/shared/services/transaction.service';
import { ValidateService } from 'app/shared/services/validate.service';
import { LabelUtils, PrimeOptions } from 'app/shared/utils/label.utils';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SchATransaction } from 'app/shared/models/scha-transaction.model';

@Component({
  selector: 'app-transaction-group-ag',
  templateUrl: './transaction-group-ag.component.html',
})
export class TransactionGroupAgComponent extends TransactionTypeX2BaseComponent implements OnInit, OnDestroy {
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
    'memo_code',
    'memo_text_input',
  ];
  override contactTypeOptions: PrimeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels).filter((option) =>
    [ContactTypes.INDIVIDUAL].includes(option.code as ContactTypes)
  );
  override childContactTypeOptions: PrimeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels).filter((option) =>
    [ContactTypes.INDIVIDUAL, ContactTypes.COMMITTEE].includes(option.code as ContactTypes)
  );

  constructor(
    protected override messageService: MessageService,
    protected override transactionService: TransactionService,
    protected override contactService: ContactService,
    protected override validateService: ValidateService,
    protected override confirmationService: ConfirmationService,
    protected override fb: FormBuilder,
    protected override router: Router,
    protected override fecDatePipe: FecDatePipe
  ) {
    super(
      messageService,
      transactionService,
      contactService,
      validateService,
      confirmationService,
      fb,
      router,
      fecDatePipe
    );
  }

  override ngOnInit(): void {
    super.ngOnInit();

    // Default the Group G entity type to Committee
    if (!this.transactionType?.childTransactionType?.transaction?.id) {
      this.childForm.get('entity_type')?.setValue(ContactTypes.COMMITTEE);
    }

    const updateContributionPurposeDescription = () => {
      const childTransaction: SchATransaction = this.transactionType?.childTransactionType
        ?.transaction as SchATransaction;
      childTransaction.entity_type = this.childForm.get('entity_type')?.value;

      this.form.patchValue({
        contribution_purpose_descrip: this.transactionType?.contributionPurposeDescripReadonly(),
      });
    };

    // Group A contribution purpose description updates with Group G contributor name updates.
    this.childForm
      .get('contributor_organization_name')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        const childTransaction: SchATransaction = this.transactionType?.childTransactionType
          ?.transaction as SchATransaction;
        childTransaction.contributor_organization_name = value;
        updateContributionPurposeDescription();
      });
    this.childForm
      .get('contributor_first_name')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        const earmarkMemo: SchATransaction = this.transactionType?.childTransactionType?.transaction as SchATransaction;
        if (earmarkMemo) {
          earmarkMemo.contributor_first_name = value;
        }
        updateContributionPurposeDescription();
      });
    this.childForm
      .get('contributor_last_name')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        const earmarkMemo: SchATransaction = this.transactionType?.childTransactionType?.transaction as SchATransaction;
        if (earmarkMemo) {
          earmarkMemo.contributor_last_name = value;
        }
        updateContributionPurposeDescription();
      });

    // Group B amount must match Group A contribution amount
    this.form
      .get('contribution_amount')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.childForm.get('contribution_amount')?.setValue(value);
      });
  }
}
