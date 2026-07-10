import { Directive, HostListener, inject } from '@angular/core';
import { StoreService } from '../services/store.service';

@Directive({
  selector: '[appSingleClick]',
  standalone: true,
  host: {
    '[attr.disabled]': 'storeService.singleClickDisabled() ? true : null',
  },
})
export class SingleClickDirective {
  protected storeService = inject(StoreService);

  @HostListener('click', ['$event'])
  onClick(event: Event) {
    if (this.storeService.singleClickDisabled()) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }

    this.storeService.disableSingleClick();
  }
}
