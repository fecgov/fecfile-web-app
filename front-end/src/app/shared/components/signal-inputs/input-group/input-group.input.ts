import { Component, computed, inject, input, model } from '@angular/core';
import { FORM_FIELD, FormField } from '@angular/forms/signals';
import { PLACEHOLDER } from 'app/shared/utils/signal-schema.utils';
import { InputGroupModule } from 'primeng/inputgroup';
import { BaseInput } from '../base.input';
import { LabelComponent } from '../label.component';

@Component({
  selector: 'app-input-group',
  imports: [InputGroupModule, LabelComponent],
  template: `
    @if (!hidden()) {
      <app-label
        [label]="label()"
        [inputId]="inputId()"
        [optional]="!required()"
        [labelStyleClass]="labelStyleClass()"
      />
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
export class InputGroupInput extends BaseInput<string> {
  readonly field = inject<FormField<string>>(FORM_FIELD, { self: true, optional: true });
  readonly pretext = input.required<string | null>();
  readonly dirty = model(false);

  readonly placeholder = computed(() => this.field?.state()?.metadata(PLACEHOLDER)?.() ?? '');
}
