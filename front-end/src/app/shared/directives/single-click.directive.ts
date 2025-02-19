import { Directive, ElementRef, HostListener, inject, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectSingleClickDisabled } from '../../store/single-click.selectors';
import { singleClickDisableAction, singleClickEnableAction } from '../../store/single-click.actions';

@Directive({ selector: '[appSingleClick]' })
export class SingleClickDirective implements OnDestroy {
  private readonly el = inject(ElementRef);
  private readonly store = inject(Store);

  constructor() {
    this.store.select(selectSingleClickDisabled).subscribe((disabled) => {
      if (disabled) this.el.nativeElement.setAttribute('disabled', 'true');
      else this.el.nativeElement.removeAttribute('disabled');
    });
  }

  @HostListener('click') onClick() {
    this.store.dispatch(singleClickDisableAction());
  }

  ngOnDestroy(): void {
    // If the single-click button disabled flag in the store has not been
    // reset to false within the code itself, set the flag when routed away
    // from the page as the button is destroyed.
    this.store.dispatch(singleClickEnableAction());
  }
}
