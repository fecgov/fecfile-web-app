import { Component, Input, OnInit } from '@angular/core';
import { BaseInputComponent } from '../base-input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NameInputComponent } from '../name-input/name-input.component';
import { InputText } from 'primeng/inputtext';
import { ErrorMessagesComponent } from '../../error-messages/error-messages.component';
import { CalendarComponent } from '../../calendar/calendar.component';

@Component({
  selector: 'app-signature-input',
  templateUrl: './signature-input.component.html',
  imports: [ReactiveFormsModule, NameInputComponent, InputText, ErrorMessagesComponent, CalendarComponent],
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
