import { Component, OnDestroy } from '@angular/core';
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
  formSubmitted = false;
}
