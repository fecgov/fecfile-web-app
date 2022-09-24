import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { JsonSchema } from 'app/shared/interfaces/json-schema.interface';
import { Transaction } from 'app/shared/interfaces/transaction.interface';
import { SchATransaction } from 'app/shared/models/scha-transaction.model';
import { TransactionService } from 'app/shared/services/transaction.service';
import { ValidateService } from 'app/shared/services/validate.service';
import { LabelUtils, PrimeOptions } from 'app/shared/utils/label.utils';
import { MessageService } from 'primeng/api';
import { takeUntil } from 'rxjs';
import { ContactTypeLabels } from '../../models/contact.model';
import { TransactionTypeBaseComponent } from '../transaction-type-base/transaction-type-base.component';

@Component({
  template: '',
  providers: [{ provide: 'ChildValidateService', useClass: ValidateService }],
})
export abstract class TransactionTypeX2BaseComponent extends TransactionTypeBaseComponent implements OnInit, OnDestroy {
  get childContributionPurposeDescrip(): string | undefined {
    return this.transactionType?.childTransactionType?.contributionPurposeDescripReadonly();
  }
  get childSchema(): JsonSchema | undefined {
    return this.transactionType?.childTransactionType?.schema;
  }
  get childTransaction(): Transaction | undefined {
    return this.transactionType?.childTransactionType?.transaction;
  }

  abstract childFormProperties: string[];

  childContactTypeOptions: PrimeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels);

  childForm: FormGroup = this.fb.group({});

  childValidateService: ValidateService = new ValidateService();

  constructor(
    protected override messageService: MessageService,
    protected override transactionService: TransactionService,
    protected override validateService: ValidateService,
    protected override fb: FormBuilder,
    protected override router: Router
  ) {
    super(messageService, transactionService, validateService, fb, router);
  }

  override ngOnInit(): void {
    // Intialize FormGroup, this must be done here. Not working when initialized only above the constructor().
    this.form = this.fb.group(this.validateService.getFormGroupFields(this.formProperties));

    // Initialize validation tracking of current JSON schema and form data
    this.validateService.formValidatorSchema = this.schema;
    this.validateService.formValidatorForm = this.form;

    // Intialize form on "Individual" entity type
    if (this.isExisting()) {
      const txn = { ...this.transaction } as SchATransaction;
      this.form.patchValue({ ...txn });
      this.form.get('entity_type')?.disable();
    } else {
      this.resetForm(this.form);
      this.form.get('entity_type')?.enable();
    }

    this.form
      ?.get('entity_type')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((entityType: string) => this.resetEntityFields(this.form, entityType));
  }

  override save(navigateTo: 'list' | 'add another' | 'add-sub-tran', transactionTypeToAdd?: string) {
    this.formSubmitted = true;

    if (this.form.invalid) {
      return;
    }

    const payload: SchATransaction = SchATransaction.fromJSON({
      ...this.transaction,
      ...this.validateService.getFormValues(this.form, this.formProperties),
    });

    if (this.transaction?.transaction_type_identifier) {
      let fieldsToValidate: string[] = this.validateService.getSchemaProperties(this.schema);
      // Remove properties populated in the back-end from list of properties to validate
      fieldsToValidate = fieldsToValidate.filter((p) => p !== 'transaction_id' && p !== 'donor_committee_name');

      if (payload.id) {
        this.transactionService
          .update(payload, this.transaction.transaction_type_identifier, fieldsToValidate)
          .subscribe((transaction) => {
            this.navigateTo(navigateTo, transaction.id || undefined, transactionTypeToAdd);
          });
      } else {
        this.transactionService
          .create(payload, this.transaction.transaction_type_identifier, fieldsToValidate)
          .subscribe((transaction) => {
            this.navigateTo(navigateTo, transaction.id || undefined, transactionTypeToAdd);
          });
      }
    }
  }
}
