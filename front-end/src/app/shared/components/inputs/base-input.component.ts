import { Component, computed, input, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DestroyerComponent } from '../destroyer.component';
import type { Transaction } from 'app/shared/models/transaction.model';
import type { TransactionTemplateMapType } from '../../models/transaction-type.model';

@Component({
  template: '',
})
export abstract class BaseInputComponent extends DestroyerComponent {
  readonly transaction = input<Transaction>();
  @Input() form: FormGroup = new FormGroup([], { updateOn: 'blur' });
  @Input() formSubmitted = false;
  @Input() templateMap: TransactionTemplateMapType = {} as TransactionTemplateMapType;

  readonly transactionType = computed(() => this.transaction()?.transactionType);
}
