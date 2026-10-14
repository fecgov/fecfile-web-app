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
    this.el.nativeElement.addEventListener('mousedown', this.handleMouseDown);
    this.el.nativeElement.addEventListener('click', this.handleCaptureClick, true);
    this.store.select(selectSingleClickDisabled).subscribe((disabled) => {
      if (this.splitBtn) {
        this.splitBtn.disabled = disabled;
        this.splitBtn.cd?.markForCheck();
      }

      if (disabled) this.el.nativeElement.setAttribute('disabled', 'true');
      else this.el.nativeElement.removeAttribute('disabled');
    });
  }

  private readonly handleMouseDown = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (this.splitBtn && target.closest('.p-splitbutton-dropdown')) return;
    // Prevent focused inputs from blurring on mousedown, which prevents premature layout shift
    // (such as disappearing validation error messages) before mouseup/click complete.
    event.preventDefault();
  };

  private readonly handleCaptureClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target.closest('.p-splitbutton-dropdown')) return;
    if (this.splitBtn && !target.closest('.p-splitbutton-button')) return;
    this.store.dispatch(singleClickDisableAction());
  };

  ngOnDestroy(): void {
    // If the single-click button disabled flag in the store has not been
    // reset to false within the code itself, set the flag when routed away
    // from the page as the button is destroyed.
    this.el.nativeElement.removeEventListener('mousedown', this.handleMouseDown);
    this.el.nativeElement.removeEventListener('click', this.handleCaptureClick, true);
    this.store.dispatch(singleClickEnableAction());
  }
}
