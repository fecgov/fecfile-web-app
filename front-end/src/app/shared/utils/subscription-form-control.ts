import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class SubscriptionFormControl<TValue = any> extends FormControl {
  subscriptions: ((value: TValue) => void)[] = [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addSubscription(action: (value: TValue) => void, destroy$?: Subject<any>) {
    this.subscriptions.push(action);
    if (destroy$) this.valueChanges.pipe(takeUntil(destroy$)).subscribe(action);
    else this.valueChanges.subscribe(action);
  }
}
