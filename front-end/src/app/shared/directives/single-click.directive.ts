import { Directive, ElementRef, HostListener, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectSpinnerStatus } from '../../store/spinner.selectors';
import { spinnerOnAction, spinnerOffAction } from '../../store/spinner.actions';

@Directive({
  selector: '[appSingleClick]',
})
export class SingleClickDirective implements OnDestroy {
  constructor(private el: ElementRef, private store: Store) {
    this.store.select(selectSpinnerStatus).subscribe((spinner) => {
      if (spinner) this.el.nativeElement.setAttribute('disabled', 'true');
      else this.el.nativeElement.removeAttribute('disabled');
    });
  }

  @HostListener('click') onClick() {
    this.store.dispatch(spinnerOnAction());
  }

  ngOnDestroy(): void {
    this.store.dispatch(spinnerOffAction());
  }
}
