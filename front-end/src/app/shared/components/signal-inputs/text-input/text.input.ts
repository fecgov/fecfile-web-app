import { Component, computed, inject, input, model } from '@angular/core';
import { FORM_FIELD, FormField, FormValueControl, ValidationError } from '@angular/forms/signals';
import { ToUpperDirective } from 'app/shared/directives/to-upper.directive';
import { PLACEHOLDER } from 'app/shared/utils/signal-schema.utils';

@Component({
  selector: 'app-text-input',
  imports: [ToUpperDirective],
  template: `
    <label [for]="inputId()">
      {{ label() }}
      @if (optional()) {
        <span class="paren-label">(OPTIONAL)</span>
      }
    </label>
    <input
      [appToUpper]="forceUpper()"
      [placeholder]="placeholder()"
      type="text"
      [value]="value()"
      [id]="inputId()"
      (blur)="touched.set(true)"
      (input)="value.set($event.target.value)"
    />
    @if (touched() && invalid()) {
      <small class="p-error" role="alert"> {{ errors()[0].message }} </small>
    }
  `,
  styleUrl: '../input.scss',
})
export class TextInput implements FormValueControl<string> {
  readonly field = inject<FormField<string>>(FORM_FIELD, { self: true, optional: true });
  readonly value = model.required<string>();
  readonly label = input.required<string>();
  readonly inputId = input.required<string>();

  readonly touched = model(false);
  readonly invalid = input(false);
  readonly errors = input<readonly ValidationError.WithOptionalFieldTree[]>([]);
  readonly forceUpper = input(false);
  readonly optional = input(false);

  readonly placeholder = computed(() => this.field?.state()?.metadata(PLACEHOLDER)?.() ?? '');
}
