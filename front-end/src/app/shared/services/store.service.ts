import { Injectable, signal } from '@angular/core';
import { NavigationEvent } from '../models';

@Injectable({ providedIn: 'root' })
export class StoreService {
  readonly singleClickDisabled = signal(false);
  readonly navigationEvent = signal<NavigationEvent | null>(null);

  disableSingleClick() {
    this.singleClickDisabled.set(true);
  }

  enableSingleClick() {
    this.singleClickDisabled.set(false);
  }

  navigate(navigationEvent: NavigationEvent) {
    this.navigationEvent.set(navigationEvent);
  }
  clearNavigate() {
    this.navigationEvent.set(null);
  }
}
