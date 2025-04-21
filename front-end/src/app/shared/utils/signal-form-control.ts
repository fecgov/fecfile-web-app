import { computed, Injector, Signal, signal } from '@angular/core';
import { connect } from 'ngxtension/connect';
import { AsyncValidatorFn, FormControl, FormControlOptions, FormControlState, ValidatorFn } from '@angular/forms';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class SignalFormControl<TValue = any> extends FormControl {
  private readonly vChange = signal<TValue | null>(null);
  readonly valueChangeSignal: Signal<TValue> = computed(() => {
    this.vChange();
    return this.value;
  });

  constructor(
    injector: Injector,
    value?: TValue | FormControlState<TValue>,
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | FormControlOptions | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null,
  ) {
    super(value, validatorOrOpts, asyncValidator);
    connect(this.vChange, this.valueChanges, injector);
  }
}
