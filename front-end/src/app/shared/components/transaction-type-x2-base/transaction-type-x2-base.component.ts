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
    // Initialize primary form.
    super.ngOnInit();

    // Initialize child form.
    this.init(
      this.childForm,
      this.childFormProperties,
      this.childValidateService,
      this.transactionType?.childTransactionType
    );
  }

  override save(navigateTo: 'list' | 'add another' | 'add-sub-tran', transactionTypeToAdd?: string) {
    this.formSubmitted = true;

    if (this.form.invalid || this.childForm.invalid) {
      return;
    }

    const payload: SchATransaction = this.getPayload(
      this.form,
      this.formProperties,
      this.validateService,
      this.transactionType
    ) as SchATransaction;

    const childPayload: SchATransaction = this.getPayload(
      this.childForm,
      this.childFormProperties,
      this.childValidateService,
      this.transactionType?.childTransactionType
    ) as SchATransaction;

    if (this.transaction?.transaction_type_identifier) {
      const fieldsToValidate: string[] = this.getFieldsToValidate(this.validateService, this.transactionType);
      const childFieldsToValidate: string[] = this.getFieldsToValidate(
        this.childValidateService,
        this.transactionType?.childTransactionType
      );

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
