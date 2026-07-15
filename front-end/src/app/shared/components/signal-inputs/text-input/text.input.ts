import { Component, computed, inject, input } from '@angular/core';
import { FORM_FIELD, FormField } from '@angular/forms/signals';
import { ToUpperDirective } from 'app/shared/directives/to-upper.directive';
import { PLACEHOLDER } from 'app/shared/utils/signal-schema.utils';
import { LabelComponent } from '../label.component';
import { BaseInput } from '../base.input';

@Component({
  selector: 'app-text-input',
  imports: [ToUpperDirective, LabelComponent],
  template: `
    <app-label [label]="label()" [inputId]="inputId()" [optional]="optional()" />
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
export class TextInput extends BaseInput<string> {
  readonly field = inject<FormField<string>>(FORM_FIELD, { self: true, optional: true });
  readonly forceUpper = input(false);

  readonly placeholder = computed(() => this.field?.state()?.metadata(PLACEHOLDER)?.() ?? '');
}
