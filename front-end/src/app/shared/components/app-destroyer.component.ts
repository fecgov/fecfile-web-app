import { Component, inject, Injector, OnDestroy, Signal } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { selectCommitteeAccount } from 'app/store/committee-account.selectors';
import { Subject } from 'rxjs';
import { SignalFormControl } from '../utils/signal-form-control';

@Component({
  template: '',
})
export abstract class DestroyerComponent implements OnDestroy {
  destroy$ = new Subject<undefined>();
  ngOnDestroy(): void {
    this.destroy$.next(undefined);
    this.destroy$.complete();
  }
}

@Component({
  template: '',
})
export abstract class FormComponent extends DestroyerComponent {
  protected readonly injector = inject(Injector);
  protected readonly fb = inject(FormBuilder);
  protected readonly store = inject(Store);
  protected readonly committeeAccount = this.store.selectSignal(selectCommitteeAccount);
  protected readonly report = this.store.selectSignal(selectActiveReport);

  protected abstract readonly form: Signal<FormGroup>;
  formSubmitted = false;

  getControl(field: string) {
    const control = this.form().get(field);
    if (!control) return undefined;
    return control as SignalFormControl;
  }
}
