import { Component, computed, input } from '@angular/core';
import { BaseInputComponent } from '../base-input.component';
import { TransactionTemplateMapType } from 'app/shared/models/transaction-type.model';
import { ReactiveFormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { ErrorMessagesComponent } from '../../error-messages/error-messages.component';

@Component({
  selector: 'app-name-input',
  templateUrl: './name-input.component.html',
  imports: [ReactiveFormsModule, InputText, ErrorMessagesComponent],
})
export class NameInputComponent extends BaseInputComponent {
  readonly templateMapKeyPrefix = input('');
  readonly labelPrefix = input('');

  readonly lastNameFieldName = computed(() => {
    if (this.templateMapKeyPrefix()) {
      return this.templateMap()[`${this.templateMapKeyPrefix}_last_name` as keyof TransactionTemplateMapType];
    }
    return this.templateMap()['last_name'];
  });

  readonly firstNameFieldName = computed(() => {
    if (this.templateMapKeyPrefix()) {
      return this.templateMap()[`${this.templateMapKeyPrefix}_first_name` as keyof TransactionTemplateMapType];
    }
    return this.templateMap()['first_name'];
  });

  readonly middleNameFieldName = computed(() => {
    if (this.templateMapKeyPrefix()) {
      return this.templateMap()[`${this.templateMapKeyPrefix}_middle_name` as keyof TransactionTemplateMapType];
    }
    return this.templateMap()['middle_name'];
  });

  readonly prefixFieldName = computed(() => {
    if (this.templateMapKeyPrefix()) {
      return this.templateMap()[`${this.templateMapKeyPrefix}_prefix` as keyof TransactionTemplateMapType];
    }
    return this.templateMap()['prefix'];
  });

  readonly suffixFieldName = computed(() => {
    if (this.templateMapKeyPrefix()) {
      return this.templateMap()[`${this.templateMapKeyPrefix}_suffix` as keyof TransactionTemplateMapType];
    }
    return this.templateMap()['suffix'];
  });
}
