import { Injectable, InjectionToken, signal } from '@angular/core';

export const USE_DYNAMIC_SIDEBAR = new InjectionToken<boolean>('Use dynamic sidebar Flag');

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  readonly showSidebar = signal(true);
}
