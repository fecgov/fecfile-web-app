import { SubscriptionFormControl } from './subscription-form-control';
import { Subject } from 'rxjs';

describe('SubscriptionFormControl', () => {
  it('should add subscription', () => {
    const control = new SubscriptionFormControl();
    const spy = jasmine.createSpy('action');
    control.addSubscription(spy);
    control.setValue('test');
    expect(spy).toHaveBeenCalledWith('test');
  });

  it('should unsubscribe when destroy$ emits', () => {
    const control = new SubscriptionFormControl();
    const spy = jasmine.createSpy('action');
    const destroy$ = new Subject<undefined>();
    control.addSubscription(spy, destroy$);
    control.setValue('test1');
    expect(spy).toHaveBeenCalledWith('test1');

    destroy$.next(undefined);
    control.setValue('test2');
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should copy control with subscriptions', () => {
    const control = new SubscriptionFormControl();
    const spy = jasmine.createSpy('action');
    control.addSubscription(spy);

    const copy = control.copy('initial');
    copy.setValue('test');
    expect(spy).toHaveBeenCalledWith('test');
  });
});
