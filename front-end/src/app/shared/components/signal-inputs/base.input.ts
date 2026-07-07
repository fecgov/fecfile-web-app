import { Component, computed, input, model } from '@angular/core';
import { FormValueControl, ValidationError } from '@angular/forms/signals';

@Component({ template: `` })
export abstract class BaseInput<T> implements FormValueControl<T> {
  readonly value = model.required<T>();
  readonly label = input.required<string>();

  readonly hidden = input(false);
  readonly required = input(false);
  readonly touched = model(false);
  readonly disabled = input(false);
  readonly invalid = input(false);
  readonly name = input<string>('');
  readonly errors = input<readonly ValidationError.WithOptionalFieldTree[]>([]);

  readonly labelStyleClass = input<string>();
  readonly id = input<string | undefined>();

  readonly optional = computed(() => !this.required() && !this.disabled());
  readonly inputId = computed(() => this.id() ?? this.name());
}
