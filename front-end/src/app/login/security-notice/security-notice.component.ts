import { Component, computed, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { environment } from 'environments/environment';
import { ProdNoticeComponent } from './prod-notice.component';
import { DevNoticeComponent } from './dev-notice.component';
import { NgComponentOutlet } from '@angular/common';
import { injectRouteData } from 'ngxtension/inject-route-data';
import { SecurityNoticeFormComponent } from './security-notice-form/security-notice-form.component';

export const SECURITY_CONSENT_VERSION = '1';

@Component({
  selector: 'app-security-notice',
  templateUrl: './security-notice.component.html',
  styleUrls: ['./security-notice.component.scss'],
  imports: [ButtonModule, NgComponentOutlet, SecurityNoticeFormComponent],
})
export class SecurityNoticeComponent {
  readonly backgroundStyle = injectRouteData('backgroundStyle');
  readonly showForm = computed(() => !!this.backgroundStyle());
  readonly componentToLoad = environment.name === 'test' ? DevNoticeComponent : ProdNoticeComponent;

  readonly hasScrolledToBottom = signal(false);
  onScroll(event: Event): void {
    if (this.hasScrolledToBottom()) return;
    const element = event.target as HTMLElement;
    if (!element) return;

    const isAtBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 5;
    if (isAtBottom) this.hasScrolledToBottom.set(true);
  }
}
