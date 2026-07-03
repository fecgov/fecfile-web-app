import { Component, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormValueControl, ValidationError } from '@angular/forms/signals';
import { PrimeOptions } from 'app/shared/utils/label.utils';
import { SelectButton } from 'primeng/selectbutton';

@Component({
  selector: 'app-select-button-input',
  imports: [SelectButton, FormsModule],
  template: ` <span [class]="labelStyleClass() ?? 'span-label'" [id]="labelId()">{{ label() }}</span>
    <p-selectbutton [ariaLabelledBy]="labelId()" [options]="options()" [(ngModel)]="value" />
    @if (dirty() && invalid()) {
      <small class="p-error">{{ errors()[0].message }}</small>
    }`,
  styleUrls: ['../input.scss'],
})
export class SelectButtonInput implements FormValueControl<string | null> {
  readonly labelId = input.required<string>();
  readonly label = input.required<string>();
  readonly labelStyleClass = input<string>();
  readonly options = input.required<PrimeOptions>();
  readonly value = model.required<string | null>();
  readonly dirty = input(false);
  readonly invalid = input(false);
  readonly errors = input<readonly ValidationError.WithOptionalFieldTree[]>([]);
}
