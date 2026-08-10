import { computed, Directive, input, model } from '@angular/core';
import { FormValueControl, ValidationError } from '@angular/forms/signals';

@Directive()
export abstract class BaseInput<T> implements FormValueControl<T> {
  readonly value = model.required<T>();
  readonly label = input.required<string>();
  readonly showOptional = input(true);

  readonly hidden = input(false);
  readonly required = input(false);
  readonly touched = model(false);
  readonly disabled = input(false);
  readonly invalid = input(false);
  readonly name = input<string>('');
  readonly errors = input<readonly ValidationError.WithOptionalFieldTree[]>([]);

  readonly labelStyleClass = input<string>();
  readonly overrideId = input<string | undefined>();

  readonly optional = computed(() => this.showOptional() && !this.required() && !this.disabled());
  readonly inputId = computed(() => this.overrideId() ?? this.name());
}
