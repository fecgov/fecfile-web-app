import { Component, computed, inject, input, model } from '@angular/core';
import { FormValueControl, ValidationError, FORM_FIELD, FormField } from '@angular/forms/signals';
import { PLACEHOLDER } from 'app/shared/utils/signal-schema.utils';
import { InputGroupModule } from 'primeng/inputgroup';

@Component({
  selector: 'app-input-group',
  imports: [InputGroupModule],
  template: `
    @if (!hidden()) {
      <label [class]="labelStyleClass()" [for]="inputId()">REPORT NAME</label>
      <p-input-group>
        @if (pretext()) {
          <span>{{ pretext() }}</span>
        }
        <input
          [placeholder]="placeholder()"
          type="text"
          [value]="value()"
          [id]="inputId()"
          class="pl-1"
          [class.opacity-60]="!value()"
          (blur)="dirty.set(true)"
          (input)="value.set($event.target.value)"
        />
      </p-input-group>

      @if (invalid() && (dirty() || value())) {
        <small class="p-error">{{ errors()[0].message }}</small>
      }
    }
  `,
  styleUrls: ['../input.scss'],
})
export class InputGroupInput implements FormValueControl<string> {
  readonly field = inject<FormField<string>>(FORM_FIELD, { self: true, optional: true });
  readonly value = model.required<string>();
  readonly pretext = input.required<string | null>();
  readonly inputId = input.required<string>();
  readonly dirty = model(false);
  readonly invalid = input(false);
  readonly hidden = input(false);
  readonly errors = input<readonly ValidationError.WithOptionalFieldTree[]>([]);
  readonly labelStyleClass = input<string>('');

  readonly placeholder = computed(() => this.field?.state()?.metadata(PLACEHOLDER)?.() ?? '');
}
