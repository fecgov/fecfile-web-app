import { Component, OnInit, Input } from '@angular/core';
import { BaseInputComponent } from '../base-input.component';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { Tooltip } from 'primeng/tooltip';
import { RadioButton } from 'primeng/radiobutton';
import { ErrorMessagesComponent } from '../../error-messages/error-messages.component';

@Component({
  selector: 'app-yes-no-radio-input',
  styleUrls: ['./yes-no-radio-input.component.scss'],
  templateUrl: './yes-no-radio-input.component.html',
  imports: [ReactiveFormsModule, Tooltip, RadioButton, ErrorMessagesComponent],
})
export class YesNoRadioInputComponent extends BaseInputComponent implements OnInit {
  control: AbstractControl | null = null;
  @Input() controlName = '';
  @Input() label = '';
  @Input() ariaLabelYes = '';
  @Input() ariaLabelNo = '';
  @Input() errorMessage = 'An answer is required';
  @Input() tooltipText = '';
  @Input() tooltipEscape = true;

  ngOnInit(): void {
    this.control = this.form.get(this.controlName);
  }
}
