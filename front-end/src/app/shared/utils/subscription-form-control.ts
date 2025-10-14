import { FormControl } from '@angular/forms';
import { MonoTypeOperatorFunction, OperatorFunction, Subject } from 'rxjs';
import { takeUntil, distinctUntilChanged } from 'rxjs/operators';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Pipeable = OperatorFunction<any, any> | MonoTypeOperatorFunction<any>;

export interface Subscription {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: (...value: any[]) => void;
  destroy$?: Subject<undefined> | Subject<boolean>;
  piped?: Pipeable[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class SubscriptionFormControl<TValue = any> extends FormControl {
  subscriptions: Subscription[] = [];

  addSubscription(
    action: (...value: TValue[]) => void,
    destroy$?: Subject<undefined> | Subject<boolean>,
    piped: Pipeable[] = [],
  ) {
    this.subscriptions.push({ action, destroy$, piped });
    if (destroy$ !== undefined) {
      piped = [takeUntil(destroy$), ...piped];
    }
    return this.valueChanges
      .pipe(distinctUntilChanged())
      .pipe(...(piped as []))
      .subscribe(action);
  }

  copy<T>(value: T, updateOn: 'blur' | 'change' | 'submit' | undefined = 'blur'): SubscriptionFormControl<T> {
    const control = new SubscriptionFormControl<T>(value, {
      validators: this.validator,
      asyncValidators: this.asyncValidator,
      updateOn,
    });

    this.subscriptions.forEach((sub) => {
      control.addSubscription(sub.action, sub.destroy$, sub.piped);
    });

    if (this.disabled) control.disable();
    if (this.touched) control.markAsTouched();
    if (this.dirty) control.markAsDirty();
    if (this.errors) control.setErrors(this.errors);

    return control;
  }
}
