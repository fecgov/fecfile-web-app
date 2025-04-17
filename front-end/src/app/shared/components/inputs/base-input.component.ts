import { Component, inject, Injector, input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TransactionTemplateMapType } from '../../models/transaction-type.model';
import { Transaction } from 'app/shared/models/transaction.model';
import { SignalFormControl } from 'app/shared/utils/signal-form-control';

@Component({
  template: '',
})
export abstract class BaseInputComponent {
  protected readonly injector = inject(Injector);
  transaction = input<Transaction>();
  form = input<FormGroup>(new FormGroup([], { updateOn: 'blur' }));
  formSubmitted = input(false);
  templateMap = input<TransactionTemplateMapType>({} as TransactionTemplateMapType);

  getControl(field: string) {
    const control = this.form().get(field);
    if (!control) return undefined;
    return control as SignalFormControl;
  }
}
