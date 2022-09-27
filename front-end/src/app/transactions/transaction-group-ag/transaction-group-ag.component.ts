import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TransactionTypeBaseComponent } from 'app/shared/components/transaction-type-base/transaction-type-base.component';
import { ContactTypeLabels, ContactTypes } from 'app/shared/models/contact.model';
import { TransactionService } from 'app/shared/services/transaction.service';
import { ValidateService } from 'app/shared/services/validate.service';
import { LabelUtils, PrimeOptions } from 'app/shared/utils/label.utils';
import { MessageService } from 'primeng/api';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-transaction-group-ag',
  templateUrl: './transaction-group-ag.component.html',
})
export class TransactionGroupAgComponent extends TransactionTypeBaseComponent implements OnInit, OnDestroy {
  formProperties: string[] = [];

  aFormProperties: string[] = [
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
    'memo_text_description',
  ];

  bFormProperties: string[] = [];

  aForm: FormGroup = this.fb.group({});

  bForm: FormGroup = this.fb.group({});

  bValidateService: ValidateService;

  override contactTypeOptions: PrimeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels).filter((option) =>
    [ContactTypes.INDIVIDUAL].includes(option.code as ContactTypes)
  );

  constructor(
    protected override messageService: MessageService,
    protected override transactionService: TransactionService,
    protected override validateService: ValidateService,
    protected override fb: FormBuilder,
    protected override router: Router
  ) {
    super(messageService, transactionService, validateService, fb, router);
    this.bValidateService = new ValidateService();
  }

  override ngOnInit(): void {
    this.aForm = this.fb.group(this.validateService.getFormGroupFields(this.aFormProperties));
    this.bForm = this.fb.group(this.bValidateService.getFormGroupFields(this.bFormProperties));

    this.validateService.formValidatorSchema = this.schema;
    this.validateService.formValidatorForm = this.aForm;

    if (this.isExisting()) {
      //retreive child transaction .../sch-a-transactions/?parent_transaction_id={this.transaction.id}
      //subscribe((child_transaction)=> {setup bForm})
      this.aForm.patchValue({ ...this.transaction });
      this.aForm.get('entity_type')?.disable();
    } else {
      this.resetForm();
      this.aForm.get('entity_type')?.enable();
      this.bForm.get('entity_type')?.enable();
    }

    this.aForm
      ?.get('entity_type')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((entityType: string) => this.resetEntityFields(this.aForm, entityType));

    this.bForm
      ?.get('entity_type')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((entityType: string) => this.resetEntityFields(this.bForm, entityType));
  }

  resetEntityFields(form: FormGroup, entityType: string) {
    if (entityType === ContactTypes.INDIVIDUAL || entityType === ContactTypes.CANDIDATE) {
      form.get('contributor_organization_name')?.reset();
    }
    if (entityType === ContactTypes.ORGANIZATION || entityType === ContactTypes.COMMITTEE) {
      const fieldsToReset: string[] = [
        'contributor_last_name',
        'contributor_first_name',
        'contributor_middle_name',
        'contributor_prefix',
        'contributor_suffix',
        'contributor_employer',
        'contributor_occupation',
      ];
      fieldsToReset.forEach((field) => form.get(field)?.reset());
    }
  }

  override resetForm() {
    this.formSubmitted = false;
    this.aForm.reset();
    this.aForm.markAsPristine();
    this.aForm.markAsUntouched();
    this.aForm.patchValue({
      entity_type: this.contactTypeOptions[0]?.code,
      contribution_aggregate: '0',
      memo_code: false,
      contribution_purpose_descrip: this.contributionPurposeDescrip,
    });
  }
}
