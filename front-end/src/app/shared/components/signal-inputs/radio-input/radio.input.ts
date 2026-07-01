import { Component, input, model } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';
import { PrimeOptions } from 'app/shared/utils/label.utils';

@Component({
  selector: 'app-radio-input',
  imports: [],
  template: `
    <fieldset class="gap-3">
      <legend class="p-0 pb-3">{{ label() }}</legend>
      @for (option of options(); track option.value) {
        <div class="flex gap-2 align-items-center">
          <input [id]="option" type="radio" [checked]="value() === option.value" (change)="value.set(option.value)" />
          <label [for]="option" class="cursor-pointer">{{ option.label }}</label>
        </div>
      }
    </fieldset>
  `,
  styleUrl: './radio.input.scss',
})
export class RadioInput implements FormValueControl<string> {
  readonly value = model.required<string>();
  readonly label = input.required<string>();
  readonly options = input.required<PrimeOptions>();
}
