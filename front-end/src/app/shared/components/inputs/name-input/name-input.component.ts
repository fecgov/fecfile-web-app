import { Component, Input, OnInit } from '@angular/core';
import { BaseInputComponent } from '../base-input.component';

@Component({
  selector: 'app-name-input',
  templateUrl: './name-input.component.html',
})
export class NameInputComponent extends BaseInputComponent implements OnInit {
  @Input() templateMapKeyPrefix = '';

  lastNameFieldName = '';
  firstNameFieldName = '';
  middleNameFieldName = '';
  prefixFieldName = '';
  suffixFieldName = '';

  ngOnInit(): void {
    switch (this.templateMapKeyPrefix) {
      case 'signatory_1':
        this.lastNameFieldName = this.templateMap['signatory_1_last_name'];
        this.firstNameFieldName = this.templateMap['signatory_1_first_name'];
        this.middleNameFieldName = this.templateMap['signatory_1_middle_name'];
        this.prefixFieldName = this.templateMap['signatory_1_prefix'];
        this.suffixFieldName = this.templateMap['signatory_1_suffix'];
        break;
      case 'signatory_2':
        this.lastNameFieldName = this.templateMap['signatory_2_last_name'];
        this.firstNameFieldName = this.templateMap['signatory_2_first_name'];
        this.middleNameFieldName = this.templateMap['signatory_2_middle_name'];
        this.prefixFieldName = this.templateMap['signatory_2_prefix'];
        this.suffixFieldName = this.templateMap['signatory_2_suffix'];
        break;
      default:
        this.lastNameFieldName = this.templateMap['last_name'];
        this.firstNameFieldName = this.templateMap['first_name'];
        this.middleNameFieldName = this.templateMap['middle_name'];
        this.prefixFieldName = this.templateMap['prefix'];
        this.suffixFieldName = this.templateMap['suffix'];
    }
  }
}
