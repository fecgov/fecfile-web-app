import { afterNextRender, Component, ElementRef, inject, Injector } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { selectCommitteeAccount } from 'app/store/committee-account.selectors';
import { blurActiveInput, printFormErrors } from '../utils/form.utils';
import { NavigationEvent } from '../models';
import { DestroyerComponent } from './destroyer.component';
import { firstValueFrom } from 'rxjs';
import { StoreService } from '../services/store.service';
import { Store } from '@ngrx/store';

@Component({
  template: '',
})
export abstract class FormComponent extends DestroyerComponent {
  readonly injector = inject(Injector);
  protected readonly fb = inject(FormBuilder);
  protected readonly store = inject(Store);
  protected readonly storeService = inject(StoreService);
  protected readonly el = inject(ElementRef);
  protected committeeAccount = this.store.selectSignal(selectCommitteeAccount);
  protected readonly activeReport = this.store.selectSignal(selectActiveReport);

  protected abstract form: FormGroup;
  formSubmitted = false;

  abstract submit(jump: 'continue' | NavigationEvent | boolean | void): Promise<void>;
  async submitForm(jump: 'continue' | NavigationEvent | boolean | void): Promise<void> {
    if (!(await this.validateForm())) return;
    await this.submit(jump);
    this.storeService.enableSingleClick();
  }

  async validateForm(): Promise<boolean> {
    this.formSubmitted = true;
    blurActiveInput(this.form);

    if (this.form.pending) await firstValueFrom(this.form.statusChanges);

    if (this.form.invalid) {
      printFormErrors(this.form);
      this.storeService.enableSingleClick();
      afterNextRender(() => this.scrollToFirstInvalidControl(), { injector: this.injector });

      return false;
    }

    return true;
  }

  scrollToFirstInvalidControl() {
    const firstInvalidControl: HTMLElement = this.el.nativeElement.querySelector('.p-error');
    if (firstInvalidControl) {
      firstInvalidControl.scrollIntoView({ behavior: 'instant', block: 'center' });
      firstInvalidControl.focus();
    }
  }
}
