import { Component, inject, Injector, Signal } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { selectCommitteeAccount } from 'app/store/committee-account.selectors';
import { SignalFormControl } from '../utils/signal-form-control';

@Component({
  template: '',
})
export abstract class FormComponent {
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
