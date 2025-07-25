import { Component, input, computed } from '@angular/core';
import { BaseInputComponent } from '../base-input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Tooltip } from 'primeng/tooltip';
import { RadioButton } from 'primeng/radiobutton';
import { ErrorMessagesComponent } from '../../error-messages/error-messages.component';

@Component({
  selector: 'app-yes-no-radio-input',
  styleUrls: ['./yes-no-radio-input.component.scss'],
  templateUrl: './yes-no-radio-input.component.html',
  imports: [ReactiveFormsModule, Tooltip, RadioButton, ErrorMessagesComponent],
})
export class YesNoRadioInputComponent extends BaseInputComponent {
  readonly controlName = input('');
  readonly label = input('');
  readonly parenLabel = input<string>();
  readonly ariaLabelYes = input('');
  readonly ariaLabelNo = input('');
  readonly errorMessage = input('An answer is required');
  readonly tooltipText = input('');
  readonly tooltipEscape = input(true);

  readonly control = computed(() => this.form.get(this.controlName()));
  readonly radioClass = computed(() =>
    this.control()?.invalid && (this.formSubmitted || this.control()?.dirty || this.control()?.touched)
      ? 'ng-invalid ng-dirty'
      : '',
  );
}
