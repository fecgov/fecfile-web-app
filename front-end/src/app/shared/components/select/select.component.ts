import { Component, computed, inject, input } from '@angular/core';
import { FormControl, FormGroup, NgControl, ReactiveFormsModule } from '@angular/forms';
import { PrimeOptions } from 'app/shared/utils/label.utils';
import { ErrorMessagesComponent } from '../error-messages/error-messages.component';

@Component({
  selector: 'app-select',
  imports: [ReactiveFormsModule, ErrorMessagesComponent],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
})
export class SelectComponent {
  ngControl = inject(NgControl);
  readonly inputId = input.required<string>();
  readonly label = input.required<string>();
  readonly options = input.required<PrimeOptions>();
  readonly form = input.required<FormGroup>();
  readonly formControlName = input.required<string>();
  readonly labelClass = input<string>('');
  readonly formSubmitted = input<boolean>(false);
  readonly includeErrorMessages = input<boolean>(true);

  readonly control = computed(() => this.ngControl.control as FormControl);

  private static nextId = 0;
  private readonly instanceId = SelectComponent.nextId++;
  readonly safeId = computed(() => `${this.inputId()}-${this.instanceId}`);
  readonly labelId = computed(() => `${this.safeId()}-label`);

  constructor() {
    this.ngControl.valueAccessor = {
      writeValue: () => {},
      registerOnChange: () => {},
      registerOnTouched: () => {},
    };
  }

  updateBlur(event: Event) {
    setTimeout(() => {
      if (event.target) (event.target as HTMLInputElement).blur();
    }, 0);
  }
}
