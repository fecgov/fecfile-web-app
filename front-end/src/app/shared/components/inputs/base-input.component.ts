import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TransactionTemplateMapType } from '../../models/transaction-type.model';
import { DestroyerComponent } from '../app-destroyer.component';
import { Transaction } from 'app/shared/models/transaction.model';

@Component({
  template: '',
})
export abstract class BaseInputComponent extends DestroyerComponent {
  @Input() transaction?: Transaction;
  @Input() form: FormGroup = new FormGroup([]);
  @Input() formSubmitted = false;
  @Input() templateMap: TransactionTemplateMapType = {} as TransactionTemplateMapType;
}
