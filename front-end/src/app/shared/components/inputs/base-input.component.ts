import { Component, computed, input, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TransactionTemplateMapType } from '../../models/transaction-type.model';
import { DestroyerComponent } from '../destroyer.component';
import { Transaction } from 'app/shared/models/transaction.model';
import { buildDataCy } from 'app/shared/utils/data-cy.utils';

@Component({
  template: '',
})
export abstract class BaseInputComponent extends DestroyerComponent {
  readonly transaction = input<Transaction>();
  @Input() form: FormGroup = new FormGroup([], { updateOn: 'blur' });
  @Input() formSubmitted = false;
  @Input() templateMap: TransactionTemplateMapType = {} as TransactionTemplateMapType;
  @Input() dataCyContext = '';

  readonly transactionType = computed(() => this.transaction()?.transactionType);

  contextDataCy(...parts: Array<string | number | null | undefined | false>): string {
    return buildDataCy(this.dataCyContext, ...parts);
  }

  fieldDataCy(fieldName: string, kind: string = 'input'): string {
    return this.contextDataCy(fieldName, kind);
  }
}
