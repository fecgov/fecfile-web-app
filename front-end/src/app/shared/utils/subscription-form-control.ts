import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export interface Subscription {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: (value: any) => void;
  destroy$?: Subject<undefined> | Subject<boolean>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class SubscriptionFormControl<TValue = any> extends FormControl {
  subscriptions: Subscription[] = [];

  addSubscription(action: (value: TValue) => void, destroy$?: Subject<undefined> | Subject<boolean>) {
    this.subscriptions.push({ action, destroy$ });
    if (destroy$) this.valueChanges.pipe(takeUntil(destroy$)).subscribe(action);
    else this.valueChanges.subscribe(action);
  }

  copy<T>(value: T, updateOn: 'blur' | 'change' | 'submit' | undefined = 'blur'): SubscriptionFormControl<T> {
    const control = new SubscriptionFormControl<T>(value, {
      validators: this.validator,
      asyncValidators: this.asyncValidator,
      updateOn,
    });

    this.subscriptions.forEach((sub) => {
      control.addSubscription(sub.action, sub.destroy$);
    });

    if (this.disabled) control.disable();
    if (this.touched) control.markAsTouched();
    if (this.dirty) control.markAsDirty();
    if (this.errors) control.setErrors(this.errors);

    return control;
  }
}
