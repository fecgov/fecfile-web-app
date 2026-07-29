import { Directive, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Directive()
export abstract class DestroyerComponent implements OnDestroy {
  destroy$ = new Subject<undefined>();
  protected componentAlive = true;
  ngOnDestroy(): void {
    this.componentAlive = false;
    this.destroy$.next(undefined);
    this.destroy$.complete();
  }
}
