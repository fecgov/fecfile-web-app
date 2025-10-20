import { Component, ElementRef, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { selectCommitteeAccount } from 'app/store/committee-account.selectors';
import { blurActiveInput, printFormErrors } from '../utils/form.utils';
import { singleClickEnableAction } from 'app/store/single-click.actions';
import { NavigationEvent } from '../models';
import { DestroyerComponent } from './destroyer.component';

@Component({
  template: '',
})
export abstract class FormComponent extends DestroyerComponent {
  protected readonly fb = inject(FormBuilder);
  protected readonly store = inject(Store);
  protected readonly el = inject(ElementRef);
  protected committeeAccount = this.store.selectSignal(selectCommitteeAccount);
  protected readonly activeReport = this.store.selectSignal(selectActiveReport);

  protected abstract form: FormGroup;
  formSubmitted = false;

  abstract submit(jump: 'continue' | NavigationEvent | boolean | void): Promise<void>;
  async submitForm(jump: 'continue' | NavigationEvent | boolean | void): Promise<void> {
    if (!(await this.validateForm())) return;
    return this.submit(jump);
  }

  async validateForm(): Promise<boolean> {
    this.formSubmitted = true;
    blurActiveInput(this.form);
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        if (this.form.invalid) {
          printFormErrors(this.form);
          this.store.dispatch(singleClickEnableAction());
          this.scrollToFirstInvalidControl();
          return resolve(false);
        }

        return resolve(true);
      }, 50);
    });
  }

  scrollToFirstInvalidControl() {
    const firstInvalidControl: HTMLElement = this.el.nativeElement.querySelector('.p-error');
    if (firstInvalidControl) {
      firstInvalidControl.scrollIntoView({ behavior: 'instant', block: 'center' });
      firstInvalidControl.focus();
    }
  }
}
