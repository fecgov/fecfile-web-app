import { Directive, ElementRef, HostListener, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectSingleClickDisabled } from '../../store/single-click.selectors';
import { singleClickDisableAction, singleClickEnableAction } from '../../store/single-click.actions';

@Directive({
  selector: '[appSingleClick]',
})
export class SingleClickDirective implements OnDestroy {
  constructor(private el: ElementRef, private store: Store) {
    this.store.select(selectSingleClickDisabled).subscribe((disabled) => {
      if (disabled) this.el.nativeElement.setAttribute('disabled', 'true');
      else this.el.nativeElement.removeAttribute('disabled');
    });
  }

  @HostListener('click') onClick() {
    this.store.dispatch(singleClickDisableAction());
  }

  ngOnDestroy(): void {
    this.store.dispatch(singleClickEnableAction());
  }
}
