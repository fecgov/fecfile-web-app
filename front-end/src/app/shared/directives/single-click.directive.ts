import { Directive, ElementRef, inject, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectSingleClickDisabled } from '../../store/single-click.selectors';
import { singleClickDisableAction, singleClickEnableAction } from '../../store/single-click.actions';
import { SplitButton } from 'primeng/splitbutton';

@Directive({ selector: '[appSingleClick]' })
export class SingleClickDirective implements OnDestroy {
  private readonly el = inject(ElementRef);
  private readonly store = inject(Store);
  private readonly splitBtn = inject(SplitButton, { optional: true });

  constructor() {
    this.el.nativeElement.addEventListener('click', this.handleCaptureClick, true);
    this.store.select(selectSingleClickDisabled).subscribe((disabled) => {
      if (this.splitBtn) {
        this.splitBtn.disabled = disabled;
      }

      if (disabled) this.el.nativeElement.setAttribute('disabled', 'true');
      else this.el.nativeElement.removeAttribute('disabled');
    });
  }

  private readonly handleCaptureClick = (event: MouseEvent) => {
    if ((event.target as HTMLElement).closest('.p-splitbutton-dropdown')) return;
    this.store.dispatch(singleClickDisableAction());
  };

  ngOnDestroy(): void {
    // If the single-click button disabled flag in the store has not been
    // reset to false within the code itself, set the flag when routed away
    // from the page as the button is destroyed.
    this.el.nativeElement.removeEventListener('click', this.handleCaptureClick, true);
    this.store.dispatch(singleClickEnableAction());
  }
}
