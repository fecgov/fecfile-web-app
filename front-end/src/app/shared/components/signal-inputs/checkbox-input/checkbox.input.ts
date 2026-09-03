import { Component, computed } from '@angular/core';
import { CheckboxModule } from 'primeng/checkbox';
import { BaseInput } from '../base.input';

@Component({
  selector: 'app-checkbox-input',
  imports: [CheckboxModule],
  template: `
    <p-checkbox
      [value]="value()"
      [binary]="true"
      [disabled]="disabled()"
      [ariaLabelledBy]="labelId()"
      [inputId]="inputId()"
      [ariaLabel]="label()"
    />
    <label [for]="inputId()" class="p-checkbox-label" [class.p-disabled]="disabled()">
      {{ label() }}
    </label>
    @if (touched() && invalid()) {
      <small class="p-error" role="alert"> {{ errors()[0].message }} </small>
    }
  `,
  styles: `
    :host {
      display: flex;
      & > .p-error {
        margin-top: 4px;
      }
    }
  `,
})
export class CheckboxInput extends BaseInput<boolean> {
  readonly labelId = computed(() => `${this.inputId()}-label`);
}
