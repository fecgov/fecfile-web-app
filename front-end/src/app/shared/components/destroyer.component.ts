import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  template: '',
})
export abstract class DestroyerComponent implements OnDestroy {
  destroy$ = new Subject<undefined>();
  protected componentAlive = true;
  ngOnDestroy(): void {
    this.componentAlive = false;
    this.destroy$.next(undefined);
    this.destroy$.complete();
  }
}
