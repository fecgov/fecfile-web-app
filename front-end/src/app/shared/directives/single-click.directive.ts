import { Directive, ElementRef, inject, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectSingleClickDisabled } from '../../store/single-click.selectors';
import { singleClickDisableAction, singleClickEnableAction } from '../../store/single-click.actions';
import { SplitButton } from 'primeng/splitbutton';
import { Subject, takeUntil } from 'rxjs';

@Directive({ selector: '[appSingleClick]' })
export class SingleClickDirective implements OnDestroy {
  private readonly el = inject(ElementRef);
  private readonly store = inject(Store);
  private readonly splitBtn = inject(SplitButton, { optional: true });
  private readonly destroy$ = new Subject<void>();

  constructor() {
    this.el.nativeElement.addEventListener('click', this.handleCaptureClick, true);

    this.store
      .select(selectSingleClickDisabled)
      .pipe(takeUntil(this.destroy$))
      .subscribe((disabled) => {
        if (this.splitBtn) {
          this.splitBtn.disabled = disabled;
        }
      });
  }

  private readonly handleCaptureClick = (event: MouseEvent) => {
    if ((event.target as HTMLElement).closest('.p-splitbutton-dropdown')) return;
    this.store.dispatch(singleClickDisableAction());
  };

  ngOnDestroy(): void {
    this.el.nativeElement.removeEventListener('click', this.handleCaptureClick, true);
    this.destroy$.next();
    this.destroy$.complete();
    this.store.dispatch(singleClickEnableAction());
  }
}
