import { Directive, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectSingleClickDisabled } from '../../store/single-click.selectors';
import { singleClickDisableAction } from '../../store/single-click.actions';

@Directive({
  selector: '[appSingleClick]',
  host: {
    '(click)': 'onClick($event)',
  },
})
export class SingleClickDirective {
  private readonly store = inject(Store);
  private readonly singleClickDisabled$ = this.store.selectSignal(selectSingleClickDisabled);

  onClick(event: Event) {
    if (this.singleClickDisabled$()) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }

    this.store.dispatch(singleClickDisableAction());
  }
}
