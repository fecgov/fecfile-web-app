import { Component, computed, input } from '@angular/core';
import { BaseInputComponent } from '../base-input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NameInputComponent } from '../name-input/name-input.component';
import { InputText } from 'primeng/inputtext';
import { ErrorMessagesComponent } from '../../error-messages/error-messages.component';
import { CalendarComponent } from '../../calendar/calendar.component';
import { SignalFormControl } from 'app/shared/utils/signal-form-control';

@Component({
  selector: 'app-signature-input',
  templateUrl: './signature-input.component.html',
  imports: [ReactiveFormsModule, NameInputComponent, InputText, ErrorMessagesComponent, CalendarComponent],
})
export class SignatureInputComponent extends BaseInputComponent {
  readonly templateMapKeyPrefix = input<'signatory_1' | 'signatory_2'>('signatory_1');
  readonly titleFieldName = computed(() => {
    if (this.templateMapKeyPrefix() === 'signatory_1') return this.templateMap()['signatory_1_date'];
    return this.templateMap()['signatory_2_title'];
  });

  readonly control = computed(() => this.form().get(this.titleFieldName()) as SignalFormControl);

  readonly dateSignedFieldName = computed(() => {
    if (this.templateMapKeyPrefix() === 'signatory_1') return this.templateMap()['signatory_1_date'];
    return this.templateMap()['signatory_2_date'];
  });
}
