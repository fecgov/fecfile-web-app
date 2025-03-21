import { Component, inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';

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
  protected readonly fb = inject(FormBuilder);
  protected abstract form: FormGroup;
  formSubmitted = false;
}
