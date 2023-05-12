import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TransactionTemplateMapType } from '../../models/transaction-type.model';
import { Destroyer } from '../app-destroyer.component';

@Component({
  template: '',
})
export abstract class BaseInputComponent extends Destroyer {
  @Input() form: FormGroup = new FormGroup([]);
  @Input() formSubmitted = false;
  @Input() templateMap: TransactionTemplateMapType = {} as TransactionTemplateMapType;
}
