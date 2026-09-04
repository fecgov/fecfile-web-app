import { Component, computed, inject, signal } from '@angular/core';
import { ProdNoticeComponent } from './prod-notice.component';
import { DevNoticeComponent } from './dev-notice.component';
import { NgComponentOutlet } from '@angular/common';
import { injectRouteData } from 'ngxtension/inject-route-data';
import { SecurityNoticeFormComponent } from './security-notice-form/security-notice-form.component';
import { API_CONFIG } from 'environments/tokens/api.config';

export const SECURITY_CONSENT_VERSION = '1';

@Component({
  selector: 'app-security-notice',
  templateUrl: './security-notice.component.html',
  styleUrls: ['./security-notice.component.scss'],
  imports: [NgComponentOutlet, SecurityNoticeFormComponent],
})
export class SecurityNoticeComponent {
  readonly apiConfig = inject(API_CONFIG);
  readonly backgroundStyle = injectRouteData('backgroundStyle');
  readonly showForm = computed(() => !!this.backgroundStyle());
  readonly componentToLoad = this.apiConfig.name === 'test' ? DevNoticeComponent : ProdNoticeComponent;

  readonly hasScrolledToBottom = signal(false);
  onScroll(event: Event): void {
    if (this.hasScrolledToBottom()) return;
    const element = event.target as HTMLElement;
    if (!element) return;

    const isAtBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 5;
    if (isAtBottom) this.hasScrolledToBottom.set(true);
  }
}
