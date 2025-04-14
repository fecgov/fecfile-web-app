import { Component, input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TransactionTemplateMapType } from '../../models/transaction-type.model';
import { DestroyerComponent } from '../app-destroyer.component';
import { Transaction } from 'app/shared/models/transaction.model';

@Component({
  template: '',
})
export abstract class BaseInputComponent extends DestroyerComponent {
  transaction = input<Transaction>();
  form = input<FormGroup>(new FormGroup([], { updateOn: 'blur' }));
  formSubmitted = input(false);
  templateMap = input<TransactionTemplateMapType>({} as TransactionTemplateMapType);
}
