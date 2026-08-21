import { afterNextRender, Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';

const routerLink = 'notifications/security';

@Component({
  selector: 'app-security-notice-sidebar',
  standalone: true,
  imports: [MenuModule],
  template: ` <p-menu [model]="items()"> </p-menu> `,
})
export class SecurityNoticeSidebarComponent {
  private readonly destroyRef = inject(DestroyRef);
  readonly activeFragment = signal<string>('overview');

  readonly rawItems = [
    { label: 'Overview', fragment: 'overview' },
    { label: 'Terms of service', fragment: 'tos' },
    { label: 'Acceptable use policy', fragment: 'aup' },
    { label: 'Sale or use restriction', fragment: 'sur' },
    { label: 'Privacy and data use', fragment: 'pdu' },
    { label: 'Consent', fragment: 'consent' },
  ] as const;

  readonly items = computed<MenuItem[]>(() => {
    const active = this.activeFragment();
    return this.rawItems.map((item) => ({
      label: item.label,
      routerLink,
      fragment: item.fragment,
      styleClass: active === item.fragment ? 'active-menu-item' : 'inactive-menu-item',
    }));
  });

  constructor() {
    afterNextRender(() => {
      const visibleIds = new Set<string>();
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              visibleIds.add(entry.target.id);
            } else {
              visibleIds.delete(entry.target.id);
            }
            const firstVisible = this.rawItems.find((item) => visibleIds.has(item.fragment));

            if (firstVisible) {
              this.activeFragment.set(firstVisible.fragment);
            }
          });
        },
        {
          root: null,
          rootMargin: '-110px 0px 0px 0px',
          threshold: 0,
        },
      );

      this.rawItems.forEach((item) => {
        const el = document.getElementById(item.fragment);
        if (el) observer.observe(el);
      });

      this.destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}
