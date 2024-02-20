import { Component, Input, OnInit } from '@angular/core';
import { BaseInputComponent } from '../base-input.component';
import { TransactionTemplateMapType } from 'app/shared/models/transaction-type.model';

@Component({
  selector: 'app-name-input',
  templateUrl: './name-input.component.html',
})
export class NameInputComponent extends BaseInputComponent implements OnInit {
  @Input() templateMapKeyPrefix = '';
  @Input() labelPrefix = '';

  lastNameFieldName = '';
  firstNameFieldName = '';
  middleNameFieldName = '';
  prefixFieldName = '';
  suffixFieldName = '';

  ngOnInit(): void {
    if (this.templateMapKeyPrefix) {
      this.lastNameFieldName =
        this.templateMap[`${this.templateMapKeyPrefix}_last_name` as keyof TransactionTemplateMapType];
      this.firstNameFieldName =
        this.templateMap[`${this.templateMapKeyPrefix}_first_name` as keyof TransactionTemplateMapType];
      this.middleNameFieldName =
        this.templateMap[`${this.templateMapKeyPrefix}_middle_name` as keyof TransactionTemplateMapType];
      this.prefixFieldName =
        this.templateMap[`${this.templateMapKeyPrefix}_prefix` as keyof TransactionTemplateMapType];
      this.suffixFieldName =
        this.templateMap[`${this.templateMapKeyPrefix}_suffix` as keyof TransactionTemplateMapType];
    } else {
      this.lastNameFieldName = this.templateMap['last_name'];
      this.firstNameFieldName = this.templateMap['first_name'];
      this.middleNameFieldName = this.templateMap['middle_name'];
      this.prefixFieldName = this.templateMap['prefix'];
      this.suffixFieldName = this.templateMap['suffix'];
    }
  }
}
