import { Component, Input, OnInit } from '@angular/core';
import { BaseInputComponent } from '../base-input.component';

@Component({
  selector: 'app-signature-input',
  templateUrl: './signature-input.component.html',
})
export class SignatureInputComponent extends BaseInputComponent implements OnInit {
  @Input() templateMapKeyPrefix = 'signatory_1';

  titleFieldName = '';
  dateSignedFieldName = '';

  ngOnInit(): void {
    switch (this.templateMapKeyPrefix) {
      case 'signatory_1':
        this.dateSignedFieldName = this.templateMap['signatory_1_date'];
        break;
      case 'signatory_2':
        this.titleFieldName = this.templateMap['signatory_2_title'];
        this.dateSignedFieldName = this.templateMap['signatory_2_date'];
        break;
    }
  }
}
